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
import WebTorrent from 'webtorrent';
import { fileStorageExpiration } from './config';
import { MovieStorageDocument, MovieStorageModel } from './movie-storage.schema';
import { trackers } from './yts-trackers';

@Injectable()
export class StreamService implements OnModuleInit {
  private client: WebTorrent.Instance = new WebTorrent();
  private moviesFolder: string = join(__dirname, '..', '..', '..', 'movies');
  private webFormats: string[] = ['mp4', 'webm'];
  private otherFormats: string[] = ['mkv'];
  private get allFormats(): string[] {
    return this.webFormats.concat(this.otherFormats);
  }

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
      if (this.client.get(movie.torrentId)) {
        this.client.remove(movie.torrentId);
      }
      const path: string = join(this.moviesFolder, movie.path);
      await rm(path, { recursive: true, force: true });
      moviesIdToDelete.push(movie.id);
    });
    await Promise.all(promises);
    if (moviesIdToDelete.length) {
      await this.movieStorageModel.deleteMany({ $or: moviesIdToDelete.map(id => ({ _id: id })) });
    }
  }

  private streamMovieAndTranscode(res: Response, movie: WebTorrent.TorrentFile): void {
    const fileSize: number = movie.length;
    const start: number = 0;
    const end: number = fileSize - 1;
    const chunkSize: number = end - start + 1;
    res.set({
      'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/' + getFileExtension(movie.name)
    });
    const stream: Readable = movie.createReadStream() as Readable;
    ffmpeg(stream)
      .toFormat('webm')
      .videoCodec('libvpx')
      .on('error', () => void 0)
      .pipe(res);
  }

  private streamMovie(res: Response, range: string, movie: WebTorrent.TorrentFile): void {
    const fileSize: number = movie.length;
    const positions: string[] = range.replace(/bytes=/, '').split('-');
    const start: number = +positions[0];
    const end: number = positions[1] ? +positions[1] : fileSize - 1;
    const chunkSize: number = end - start + 1;
    res.set({
      'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/' + getFileExtension(movie.name)
    });
    const stream: Readable = movie.createReadStream({ start, end }) as Readable;
    stream.pipe(res);
  }

  private getRange(req: Request): string {
    const range: string | undefined = req.headers.range;
    if (!range) {
      throw new HttpException('Wrong range', HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE);
    }
    return range;
  }

  private async getReadStreamFromTorrent(hash: string): Promise<WebTorrent.TorrentFile> {
    let torrent: WebTorrent.Torrent = this.client.torrents.find(trnt => trnt.infoHash === hash.toLowerCase());
    if (!torrent) {
      const magnet: string = `magnet:?xt=urn:btih:${hash}&tr=` + trackers.join('&tr=');
      torrent = await new Promise(resolve => this.client.add(magnet, { path: this.moviesFolder }, resolve));
    } else if (!torrent.ready) {
      await new Promise(resolve => torrent.on('ready', () => resolve(void 0)));
    }
    const movie: WebTorrent.TorrentFile = torrent.files.find(file =>
      this.allFormats.includes(getFileExtension(file.name))
    );
    if (!movie) {
      throw new NotFoundException('Torrent does not contain movie with a valid format');
    }
    await this.upsertMovie(torrent.magnetURI, movie.path);
    return movie;
  }

  public async stream(req: Request, res: Response, hash: string): Promise<void> {
    const range: string = this.getRange(req);
    const movie: WebTorrent.TorrentFile = await this.getReadStreamFromTorrent(hash);
    const movieExtension: string = getFileExtension(movie.name);
    if (this.webFormats.includes(movieExtension)) {
      this.streamMovie(res, range, movie);
    } else {
      this.streamMovieAndTranscode(res, movie);
    }
  }
}
