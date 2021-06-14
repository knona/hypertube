<script lang="ts">
  import type { Movie } from '../../../../Models/Movie';
  import type { ServerError } from '../../../../Models/Server/Errors/ServerError';
  import MovieManager from '../../../../Modules/Movie/MovieManager';
  import { componentState } from '../../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../../Modules/Store/ComponentState/Models/State';
  import { infiniteMovieList } from '../../../../Modules/Store/InfiniteMovieListStore/InfiniteMovieListStore';
  import { preferences } from '../../../../Modules/Store/Preference/PreferenceStore';
  import InfiniteScroll from '../../../Components/InfiniteScroll/InfiniteScroll.svelte';
  import InfoMessage from '../../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import MovieGrid from '../../../Components/MovieGrid/MovieGrid.svelte';

  export let movieId: string;

  let recommendationState: State<ServerError> = componentState({ current: ComponentStateType.loading });
  let recommendedMovies = infiniteMovieList();
  let isLoadingMoreMovies: boolean = false;

  function getRecommendations(fromInfiniteScrolling: boolean = false): void {
    if (!$recommendedMovies.hasData) {
      return;
    }
    if (!fromInfiniteScrolling) {
      recommendedMovies.reset();
      recommendationState.setLoading();
    }
    MovieManager.getMovieRecommendations(movieId, $recommendedMovies.page, $preferences.language)
      .then((movies: Movie[]) => {
        recommendationState.setDefault();
        recommendedMovies.incrementPage();
        if (movies.length === 0) {
          recommendedMovies.hasNoMoreData();
        } else {
          if (fromInfiniteScrolling) {
            recommendedMovies.addMovies(movies);
          } else {
            recommendedMovies.setMovies(movies);
          }
        }
      })
      .catch(recommendationState.setError)
      .finally(() => {
        isLoadingMoreMovies = false;
      });
  }

  $: {
    movieId;
    getRecommendations();
  }
</script>

{#if $recommendationState.current === ComponentStateType.loading}
  <div class="w-full v-stack items-center justify-center">
    <LoadingIndicator />
  </div>
{:else if $recommendationState.current === ComponentStateType.error}
  <div class="w-full v-stack items-center justify-center">
    <InfoMessage type={InfoMessageType.error}>
      <LocalizedServerError serverError={$recommendationState.error} />
    </InfoMessage>
  </div>
{:else}
  <div class="w-full">
    <MovieGrid movies={$recommendedMovies.movies} />
    <InfiniteScroll
      bind:isLoading={isLoadingMoreMovies}
      useWindow={true}
      threshold={800}
      on:loadMore={() => getRecommendations(true)}
    />
  </div>
{/if}
