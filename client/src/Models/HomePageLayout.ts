import { carouselMoviesCount } from '../Shared/Constants';
import type { Movie } from './Movie';

export class HomePageLayout {
  public headers: Movie[];
  public content: Movie[];
  public page: number;

  public constructor(movies: Movie[]) {
    this.page = 1;
    this.headers = [];
    this.content = [];
    movies.forEach((movie: Movie) => {
      if (this.headers.length < carouselMoviesCount) {
        this.headers.push(movie);
      }
      this.content.push(movie);
    });
  }

  public addingMovies(movies: Movie[]): HomePageLayout {
    movies.forEach(movie => this.content.push(movie));
    return this;
  }

  public incrementingPage(): HomePageLayout {
    this.page += 1;
    return this;
  }
}
