export enum SearchSort {
  DOWNLOAD_COUNT = 'DOWNLOAD_COUNT',
  LIKE_COUNT = 'LIKE_COUNT',
  YEAR = 'YEAR',
  TITLE = 'TITLE',
  RATING = 'RATING'
}

export const AllSearchSort: SearchSort[] = Object.values(SearchSort);
