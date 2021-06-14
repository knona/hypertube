import type { ServerError } from '../../../../Models/Server/Errors/ServerError';
import type { User } from '../../../../Models/User';
import type { Optional } from '../../../../Shared/Types';
import type { ComponentState } from '../../ComponentState/Models/ComponentState';

export interface CurrentUserStoreState {
  user: Optional<User>;
  favoriteMovies: {
    state: ComponentState<ServerError>;
    page: number;
    hasData: boolean;
  };
  watchedMovies: {
    state: ComponentState<ServerError>;
    page: number;
    hasData: boolean;
  };
}
