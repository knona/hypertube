export enum MovieSort {
  downloadCount = 'download_count',
  likeCount = 'like_count',
  year = 'year',
  title = 'title',
  rating = 'rating'
}

export const movieSortResolver: Record<string, MovieSort> = {
  DOWNLOAD_COUNT: MovieSort.downloadCount,
  LIKE_COUNT: MovieSort.likeCount,
  YEAR: MovieSort.year,
  TITLE: MovieSort.title,
  RATING: MovieSort.rating
};
