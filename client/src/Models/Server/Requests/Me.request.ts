import { gql } from 'graphql-request';
import type { RequestDocument } from 'graphql-request/dist/types';

export const ME: RequestDocument = gql`
  query ($language: Language) {
    me {
      id
      firstName
      lastName
      username
      email
      pictureUrl
      comments {
        id
        tmdbId
        author {
          id
          firstName
          lastName
          username
          email
          pictureUrl
        }
        content
        createdAt
        updatedAt
      }
      favoriteMovies(page: 1, language: $language) {
        imdbId
        tmdbId
        title
        overview
        posterUrl
        backdropUrl
        releaseDate
        genres
        originalTitle
        originalLanguage
        popularity
        voteCount
        voteAverage
        budget
        tagline
        runtime
        isFavorite
        isWatched
        videos {
          key
          name
          size
        }
        torrents {
          hash
          quality
          seeds
          peers
          size
        }
        actors {
          name
          # popularity
          profileUrl
          character
        }
        director {
          name
          # popularity
          profileUrl
        }
        comments {
          id
          tmdbId
          author {
            id
            firstName
            lastName
            username
            email
            pictureUrl
          }
          content
          createdAt
          updatedAt
        }
      }
      watchedMovies(page: 1, language: $language) {
        imdbId
        tmdbId
        title
        overview
        posterUrl
        backdropUrl
        releaseDate
        genres
        originalTitle
        originalLanguage
        popularity
        voteCount
        voteAverage
        budget
        tagline
        runtime
        isFavorite
        isWatched
        videos {
          key
          name
          size
        }
        torrents {
          hash
          quality
          seeds
          peers
          size
        }
        actors {
          name
          # popularity
          profileUrl
          character
        }
        director {
          name
          # popularity
          profileUrl
        }
        comments {
          id
          tmdbId
          author {
            id
            firstName
            lastName
            username
            email
            pictureUrl
          }
          content
          createdAt
          updatedAt
        }
      }
    }
  }
`;
