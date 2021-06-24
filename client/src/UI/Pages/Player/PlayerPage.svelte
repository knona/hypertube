<script lang="ts">
  import { _ } from 'svelte-i18n';

  import type { DetailedMovie } from '../../../Models/DetailedMovie';
  import type { ServerError } from '../../../Models/Server/Errors/ServerError';
  import type { Torrent } from '../../../Models/Torrent';
  import MovieManager from '../../../Modules/Movie/MovieManager';
  import Navigation from '../../../Modules/Navigation/Navigation';
  import { componentState } from '../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../Modules/Store/ComponentState/Models/State';
  import { movieStore } from '../../../Modules/Store/Movie/MovieStore';
  import type { MovieStore } from '../../../Modules/Store/Movie/MovieStore.interface';
  import { preferences } from '../../../Modules/Store/Preference/PreferenceStore';
  import type { Nullable, Optional } from '../../../Shared/Types';
  import InfoMessage from '../../Components/InfoMessage/InfoMessage.svelte';
  import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../Components/RoundedButton/RoundedButton.svelte';
  import Player from './Components/Player.svelte';

  const urlParameters: URLSearchParams = new URLSearchParams(window.location.search);
  const movieId: Nullable<string> = urlParameters.get('movie');
  const torrentHash: Nullable<string> = urlParameters.get('torrent');
  let state: State<ServerError> = componentState({ current: ComponentStateType.loading });
  let store: MovieStore = movieStore();
  let torrent: Optional<Torrent>;

  function getMovie(): void {
    if (movieId) {
      torrent = undefined;
      store.setMovie(undefined);
      state.setLoading();
      MovieManager.getMovieWithId(movieId, $preferences.language)
        .then((movie: DetailedMovie) => {
          store.setMovie(movie);
          torrent = getTorrentFromMovie(movie);
          if (torrent) {
            state.setDefault();
          } else {
            Navigation.navigateTo('/home');
          }
        })
        .catch(state.setError);
    } else {
      Navigation.navigateTo('/home');
    }
  }

  function getTorrentFromMovie(movie: DetailedMovie): Optional<Torrent> {
    if (movie.torrents.length > 0) {
      if (torrentHash) {
        return movie.torrents.find(t => t.hash === torrentHash);
      }
      return movie.torrents[0];
    }
    return undefined;
  }

  $: {
    movieId;
    torrentHash;
    getMovie();
  }
</script>

<div class="w-screen h-screen v-stack items-center justify-center">
  {#if $state.current === ComponentStateType.loading}
    <LoadingIndicator />
  {:else if $state.current === ComponentStateType.error}
    <div class="v-stack space-y-4">
      <InfoMessage>
        <LocalizedServerError serverError={$state.error} />
      </InfoMessage>
      <RoundedButton title={$_('page.player.state.error.retryButton.title')} on:click={getMovie} />
    </div>
  {:else if torrent}
    <Player {torrent} bind:movie={store} />
  {/if}
</div>
