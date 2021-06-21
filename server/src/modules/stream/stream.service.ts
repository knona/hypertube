import { HttpException, HttpStatus, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { rm } from 'fs/promises';
import { Model } from 'mongoose';
import { scheduleJob } from 'node-schedule';
import { dirname, join, relative } from 'path';
import { everyDayAt4h } from 'src/shared/utils/cron.utils';
import { computeExpirationDate } from 'src/shared/utils/date.utils';
import { getFileExtension } from 'src/shared/utils/file-extension.utils';
import { Readable } from 'stream';
import { fileStorageExpiration } from './config';
import { MovieStorageDocument, MovieStorageModel } from './movie-storage.schema';
import { trackers } from './yts-trackers';
import torrentStream from 'torrent-stream';

interface MovieStream {
  magnet: string;
  size: number;
  extension: string;
  path: string;
  createReadStream: (opts?: { start: number; end: number }) => Readable;
}

type TorrentFile = TorrentStream.TorrentFile;
type TorrentEngine = TorrentStream.TorrentEngine;

@Injectable()
export class StreamService implements OnModuleInit {
  private moviesFolder: string = join(__dirname, '..', '..', '..', 'movies');
  private webFormats: string[] = ['mp4', 'webm'];
  private otherFormats: string[] = ['mkv'];
  private get allFormats(): string[] {
    return this.webFormats.concat(this.otherFormats);
  }
  private engines: {
    [hash: string]: { engine: TorrentEngine; movie: TorrentFile; ready: boolean };
  } = {};

  public constructor(
    @InjectModel(MovieStorageModel.name) private readonly movieStorageModel: Model<MovieStorageDocument>
  ) {}

  public onModuleInit(): void {
    scheduleJob(everyDayAt4h, () => this.deleteExpiredMovies());
  }

  public async upsertMovie(torrentId: string, path: string): Promise<void> {
    const dir: string = dirname(path);
    const finalPath: string = relative(this.moviesFolder, dir) === '' ? path : dir;
    await this.movieStorageModel.findOneAndUpdate(
      { torrentId, path: finalPath },
      { expiration: computeExpirationDate(fileStorageExpiration) },
      { upsert: true }
    );
  }

  public async deleteExpiredMovies(): Promise<void> {
    const movies: MovieStorageDocument[] = await this.movieStorageModel.find({ expiration: { $lte: new Date() } });
    const moviesIdToDelete: string[] = [];
    const promises: Promise<void>[] = movies.map(async movie => {
      const path: string = join(this.moviesFolder, movie.path);
      await rm(path, { recursive: true, force: true });
      moviesIdToDelete.push(movie.id);
    });
    await Promise.all(promises);
    if (moviesIdToDelete.length) {
      await this.movieStorageModel.deleteMany({ $or: moviesIdToDelete.map(id => ({ _id: id })) });
    }
  }

  private streamMovieAndTranscode(res: Response, movieStream: MovieStream): void {
    const fileSize: number = movieStream.size;
    const start: number = 0;
    const end: number = fileSize - 1;
    const chunkSize: number = end - start + 1;
    res.set({
      'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/' + movieStream.extension
    });
    const stream: Readable = movieStream.createReadStream() as Readable;
    ffmpeg(stream)
      .toFormat('webm')
      .videoCodec('libvpx')
      .on('error', () => void 0)
      .pipe(res);
  }

  private streamMovie(res: Response, range: string, movieStream: MovieStream): void {
    const fileSize: number = movieStream.size;
    const positions: string[] = range.replace(/bytes=/, '').split('-');
    const start: number = +positions[0];
    const end: number = positions[1] ? +positions[1] : fileSize - 1;
    const chunkSize: number = end - start + 1;
    res.set({
      'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/' + movieStream.extension
    });
    const stream: Readable = movieStream.createReadStream({ start, end }) as Readable;
    stream.pipe(res);
  }

  private getRange(req: Request): string {
    const range: string | undefined = req.headers.range;
    if (!range) {
      throw new HttpException('Wrong range', HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
    }
    return range;
  }

  private async setMovie(hash: string): Promise<void> {
    const engine: TorrentEngine = this.engines[hash].engine;
    await new Promise(resolve => engine.on('ready', resolve));
    this.engines[hash].ready = true;
    let movie: TorrentFile;
    engine.files.forEach(file => {
      if (this.allFormats.includes(getFileExtension(file.name))) {
        movie = file;
      } else {
        file.deselect();
      }
    });
    if (!movie) {
      delete this.engines[hash];
      throw new NotFoundException('Torrent does not contain movie with a valid format');
    }
    this.engines[hash].movie = movie;
  }

  private async getMovieStream(hash: string): Promise<MovieStream> {
    const magnet: string = `magnet:?xt=urn:btih:${hash}`;
    if (!this.engines[hash]) {
      const engine: TorrentEngine = torrentStream(magnet, { trackers, uploads: 0, path: this.moviesFolder });
      this.engines[hash] = { engine, ready: false, movie: null };
    }
    if (!this.engines[hash] || !this.engines[hash].ready) {
      await this.setMovie(hash);
    }
    const movie: TorrentFile = this.engines[hash].movie;
    return {
      magnet,
      path: movie.path,
      size: movie.length,
      extension: getFileExtension(movie.name),
      createReadStream: movie.createReadStream
    };
  }

  public async stream(req: Request, res: Response, hash: string): Promise<void> {
    const range: string = this.getRange(req);
    const movieStream: MovieStream = await this.getMovieStream(hash.toLowerCase());
    await this.upsertMovie(movieStream.magnet, movieStream.path);
    if (this.webFormats.includes(movieStream.extension)) {
      this.streamMovie(res, range, movieStream);
    } else {
      this.streamMovieAndTranscode(res, movieStream);
    }
  }
}
