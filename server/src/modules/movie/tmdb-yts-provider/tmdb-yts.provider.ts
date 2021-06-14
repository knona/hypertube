import CacheableLookup from 'cacheable-lookup';
import { Resolver } from 'dns';
import got, { Got } from 'got/dist/source';
import { Actor, Director, FiltersInput, Torrent, YoutubeTrailer } from 'src/graphql';
import { Language } from '../enums/language.enum';
import { MovieProvider } from '../movie-provider';
import { PartialDetailedMovie } from '../types/partial-detailed-movie.type';
import { PartialMovie } from '../types/partial-movie.type';
import { tmdbGenres } from './tmdb-genres';
import { TmdbDetailedMovie, TmdbMovie, TmdbVideo } from './tmdb-movie.interface';
import { regions } from './tmdb-regions';
import {
  TmdbCastPerson,
  TmdbCreditsResponse,
  TmdbCrewPerson,
  TmdbFindResponse,
  TmdbMoviesResponse
} from './tmdb-responses.interface';
import { YtsSeachResponse, YtsTorrent } from './yts-responses.interface';

export class TmdbYts implements MovieProvider {
  private tmdbClient: Got;
  private ytsClient: Got;

  public constructor() {
    this.tmdbClient = got.extend({
      prefixUrl: 'https://api.themoviedb.org/3/',
      searchParams: { api_key: '1ba33285d873302030d5c1daacc6f95b' },
      responseType: 'json'
    });

    const resolver: Resolver = new Resolver();
    resolver.setServers(['1.1.1.1']);
    this.ytsClient = got.extend({
      prefixUrl: 'https://yts.mx/api/v2/list_movies.json',
      responseType: 'json',
      dnsCache: new CacheableLookup({ resolver })
    });
  }

  private tmdbMovieToMovie(movie: TmdbMovie): PartialMovie {
    return {
      tmdbId: movie.id,
      posterUrl: movie.poster_path ? 'https://image.tmdb.org/t/p/w300/' + movie.poster_path : undefined,
      backdropUrl: movie.backdrop_path ? 'https://image.tmdb.org/t/p/original/' + movie.backdrop_path : undefined,
      overview: movie.overview,
      releaseDate: movie.release_date,
      genres: movie.genre_ids.map(id => tmdbGenres[id].name),
      originalTitle: movie.original_title,
      originalLanguage: movie.original_language,
      title: movie.title,
      popularity: movie.popularity,
      voteCount: movie.vote_count,
      voteAverage: movie.vote_average
    };
  }

  private tmdbVideoToYoutubeTrailer(videos: TmdbVideo[]): YoutubeTrailer[] {
    return videos
      .filter(video => video.site === 'YouTube' && video.type === 'Trailer')
      .map(video => ({ key: video.key, name: video.name, size: video.size }));
  }

  private ytsTorrentsToTorrents(torrents: YtsTorrent[]): Torrent[] {
    return torrents
      .filter(torrent => torrent.quality !== '3D')
      .map(torrent => ({
        hash: torrent.hash,
        peers: torrent.peers,
        seeds: torrent.seeds,
        quality: torrent.quality,
        size: torrent.size
      }));
  }

  private getDirectorFromTmdbResponse(crew: TmdbCrewPerson[]): Director {
    const director: TmdbCrewPerson = crew.find(person => person.job === 'Director');
    if (!director) {
      return undefined;
    }
    return {
      name: director.name,
      popularity: director.popularity,
      profileUrl: director.profile_path ? 'https://image.tmdb.org/t/p/w200/' + director.profile_path : undefined
    };
  }

  private getActorsFromTmdbResponse(cast: TmdbCastPerson[]): Actor[] {
    return cast
      .filter(person => person.known_for_department === 'Acting')
      .slice(0, 10)
      .map(person => ({
        character: person.character,
        name: person.name,
        popularity: person.popularity,
        profileUrl: person.profile_path ? 'https://image.tmdb.org/t/p/w200/' + person.profile_path : undefined
      }));
  }

  private tmdbDetailedMovieToDetailedMovie(
    movie: TmdbDetailedMovie,
    torrents: YtsTorrent[],
    cast: TmdbCastPerson[],
    crew: TmdbCrewPerson[]
  ): PartialDetailedMovie {
    return {
      tmdbId: movie.id,
      imdbId: movie.imdb_id,
      posterUrl: movie.poster_path ? 'https://image.tmdb.org/t/p/w300/' + movie.poster_path : undefined,
      backdropUrl: movie.backdrop_path ? 'https://image.tmdb.org/t/p/original/' + movie.backdrop_path : undefined,
      overview: movie.overview,
      releaseDate: movie.release_date,
      genres: movie.genres.map(genre => genre.name),
      originalTitle: movie.original_title,
      originalLanguage: movie.original_language,
      title: movie.title,
      popularity: movie.popularity,
      voteCount: movie.vote_count,
      voteAverage: movie.vote_average,
      budget: movie.budget,
      tagline: movie.tagline,
      runtime: movie.runtime,
      videos: movie.videos?.results ? this.tmdbVideoToYoutubeTrailer(movie.videos.results) : [],
      torrents: this.ytsTorrentsToTorrents(torrents),
      actors: this.getActorsFromTmdbResponse(cast),
      director: this.getDirectorFromTmdbResponse(crew)
    };
  }

  public async popular(page: number, language: Language = Language.en): Promise<PartialMovie[]> {
    const res: TmdbMoviesResponse = await this.tmdbClient.get<TmdbMoviesResponse>('movie/popular', {
      searchParams: { page, language, region: regions[language] },
      resolveBodyOnly: true
    });
    return res.results.map(this.tmdbMovieToMovie);
  }

  public async topRated(page: number, language: Language = Language.en): Promise<PartialMovie[]> {
    const res: TmdbMoviesResponse = await this.tmdbClient.get<TmdbMoviesResponse>('movie/top_rated', {
      searchParams: { page, language, region: regions[language] },
      resolveBodyOnly: true
    });
    return res.results.map(this.tmdbMovieToMovie);
  }

  public async recommendations(
    page: number,
    tmdbId: number,
    language: Language = Language.en
  ): Promise<PartialMovie[]> {
    const res: TmdbMoviesResponse = await this.tmdbClient.get<TmdbMoviesResponse>(`movie/${tmdbId}/recommendations`, {
      searchParams: { page, language, region: regions[language] },
      resolveBodyOnly: true
    });
    if (res.page !== page) {
      return [];
    }
    return res.results.map(this.tmdbMovieToMovie);
  }

  private getMovieNumberAtPage(movieCount: number, pageNumber: number, limit: number): number {
    const remainingMovies: number = movieCount - limit * (pageNumber - 1);
    if (remainingMovies <= 0) {
      return 0;
    }
    return remainingMovies >= limit ? limit : remainingMovies;
  }

  private getSearchParamsForMovieSearch(filters: FiltersInput, limit: number, page: number): URLSearchParams {
    const searchParams: Record<string, string> = {
      query_term: filters.queryTerm,
      limit: limit.toString(),
      page: page.toString()
    };
    if (filters.genre) {
      searchParams.genre = filters.genre;
    }
    if (filters.sortBy) {
      searchParams.sort_by = filters.sortBy;
    }
    if (filters.orderBy) {
      searchParams.order_by = filters.orderBy;
    }
    if (filters.minRating) {
      searchParams.minimum_rating = filters.minRating.toString();
    }
    return new URLSearchParams(searchParams);
  }

  public async search(page: number, filters: FiltersInput, language: Language = Language.en): Promise<PartialMovie[]> {
    const limit: number = 10;
    const searchParams: URLSearchParams = this.getSearchParamsForMovieSearch(filters, limit, page);
    const data: YtsSeachResponse['data'] = (
      await this.ytsClient.get<YtsSeachResponse>('', { searchParams, resolveBodyOnly: true })
    ).data;
    if (!data.movies) {
      return [];
    }
    const moviesInPage: number = this.getMovieNumberAtPage(data.movie_count, data.page_number, limit);
    if (!moviesInPage) {
      return [];
    }
    const movies: PartialMovie[] = new Array(moviesInPage);
    const imdbIds: string[] = data.movies.map(movie => movie.imdb_code);
    const promises: Promise<void>[] = imdbIds.map((imdb, index) =>
      this.tmdbClient
        .get<TmdbFindResponse>(`find/${imdb}`, {
          searchParams: { external_source: 'imdb_id', language, region: regions[language] },
          resolveBodyOnly: true
        })
        .then(res => {
          if (res.movie_results.length !== 0) {
            movies[index] = this.tmdbMovieToMovie(res.movie_results[0]);
          }
        })
    );
    await Promise.all(promises);
    return movies.filter(movie => !!movie);
  }

  public async movie(tmdbId: number, language: Language = Language.en): Promise<PartialDetailedMovie> {
    const detailsPromise: Promise<TmdbDetailedMovie> = this.tmdbClient.get<TmdbDetailedMovie>(`movie/${tmdbId}`, {
      searchParams: { language, region: regions[language], append_to_response: 'videos' },
      resolveBodyOnly: true
    });
    const creditsPromise: Promise<TmdbCreditsResponse> = this.tmdbClient.get<TmdbCreditsResponse>(
      `movie/${tmdbId}/credits`,
      { searchParams: { language, region: regions[language] }, resolveBodyOnly: true }
    );
    const [details, credits] = await Promise.all([detailsPromise, creditsPromise]);
    const search: YtsSeachResponse = await this.ytsClient.get<YtsSeachResponse>('', {
      searchParams: { query_term: details.imdb_id },
      resolveBodyOnly: true
    });
    return this.tmdbDetailedMovieToDetailedMovie(
      details,
      search.data.movies?.[0]?.torrents ?? [],
      credits.cast,
      credits.crew
    );
  }
}
