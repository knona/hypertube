export interface YtsTorrent {
  url: string;
  hash: string;
  quality: string;
  type: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: string;
  date_uploaded_unix: number;
}

export interface YtsSeachResponse {
  data: {
    movie_count: number;
    limit: number;
    page_number: number;
    movies: (Record<string, any> & { imdb_code: string; torrents: YtsTorrent[] })[];
  };
}
