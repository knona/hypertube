import { HomePageLayout } from '../../Models/HomePageLayout';
import type { Movie } from '../../Models/Movie';
import { POPULAR } from '../../Models/Server/Requests/Popular.request';
import { TOP_RATED } from '../../Models/Server/Requests/TopRated.request';
import type { PopularResponse } from '../../Models/Server/Responses/PopularResponse';
import type { TopRatedResponse } from '../../Models/Server/Responses/TopRatedResponse';
import { backLanguageForLanguage } from '../../Utils/LanguageUtils';
import { Request } from '../Request/Request';
import { popularHomePageLayout, topRatedHomePageLayout } from '../Store/Home/HomePageLayoutStore';
import type { HomePageLayoutStore } from '../Store/Home/HomePageLayoutStore.interface';
import { token } from '../Store/Token/TokenStore';

function createHomePageLayout(layoutStore: HomePageLayoutStore, movies: Movie[]): void {
  const layout: HomePageLayout = new HomePageLayout(movies);
  layoutStore.set(layout);
}

function updateHomePageLayout(layoutStore: HomePageLayoutStore, movies: Movie[]): void {
  layoutStore.addMovies(movies);
  layoutStore.incrementPage();
}

async function getPopular(language: string): Promise<void> {
  const request: Request = new Request(POPULAR, { page: 1, language: backLanguageForLanguage(language) });
  request.token = token.getString();
  const response: PopularResponse = await request.perform<PopularResponse>();
  createHomePageLayout(popularHomePageLayout, response.popular);
}

async function getMorePopular(language: string): Promise<void> {
  const request: Request = new Request(POPULAR, {
    page: popularHomePageLayout.getNextPage(),
    language: backLanguageForLanguage(language)
  });
  request.token = token.getString();
  const response: PopularResponse = await request.perform<PopularResponse>();
  updateHomePageLayout(popularHomePageLayout, response.popular);
}

async function getTopRated(): Promise<void> {
  const request: Request = new Request(TOP_RATED, { page: 1, language: 'EN' });
  request.token = token.getString();
  const response: TopRatedResponse = await request.perform<TopRatedResponse>();
  createHomePageLayout(topRatedHomePageLayout, response.topRated);
}

async function getMoreTopRated(): Promise<void> {
  const request: Request = new Request(TOP_RATED, { page: topRatedHomePageLayout.getNextPage(), language: 'EN' });
  request.token = token.getString();
  const response: TopRatedResponse = await request.perform<TopRatedResponse>();
  updateHomePageLayout(topRatedHomePageLayout, response.topRated);
}

export default {
  getPopular,
  getMorePopular,
  getTopRated,
  getMoreTopRated
};
