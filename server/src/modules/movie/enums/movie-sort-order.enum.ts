export enum MovieSortOrder {
  desc = 'desc',
  asc = 'asc'
}

export const movieSortOrderResolver: Record<string, MovieSortOrder> = {
  DESC: MovieSortOrder.desc,
  ASC: MovieSortOrder.asc
};
