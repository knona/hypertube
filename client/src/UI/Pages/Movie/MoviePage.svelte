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
  import EmptyView from '../../Components/EmptyView/EmptyView.svelte';
  import Footer from '../../Components/Footer/Footer.svelte';
  import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import RoundedButton from '../../Components/RoundedButton/RoundedButton.svelte';
  import MovieCharacter from './Components/MovieCharacter.svelte';
  import MovieHeader from './Components/MovieHeader.svelte';
  import MovieSection from './Components/MovieSection.svelte';
  import MovieSegmentedSection from './Components/MovieSegmentedSection.svelte';
  import MovieTrailers from './Components/MovieTrailers.svelte';
  import MoviePlayer from './Components/Player/MoviePlayer.svelte';

  export let movieId: string;

  let state: State<ServerError> = componentState({ current: ComponentStateType.loading });
  let movie: MovieStore = movieStore();
  let isPlayerVisible: boolean = false;
  let torrent: Torrent;

  function getMovie(): void {
    state.setLoading();
    MovieManager.getMovieWithId(movieId, $preferences.language)
      .then((fetchedMovie: DetailedMovie) => {
        movie.setMovie(fetchedMovie);
        state.setDefault();
      })
      .catch(state.setError);
  }

  function goToHome(): void {
    Navigation.navigateTo('/');
  }

  $: {
    movieId;
    getMovie();
  }

  $: {
    isPlayerVisible;
    document.body.style.overflow = isPlayerVisible ? 'hidden' : '';
  }

  function handlePlay(event: CustomEvent<Torrent>): void {
    torrent = event.detail;
    isPlayerVisible = true;
  }
</script>

{#if $state.current === ComponentStateType.loading}
  <div class="w-screen h-screen v-stack items-center justify-center">
    <LoadingIndicator />
  </div>
{:else if $state.current === ComponentStateType.error}
  <div class="w-screen h-screen v-stack items-center justify-center">
    <EmptyView description="Movie not found">
      <RoundedButton title="Go to home" on:click={goToHome} />
    </EmptyView>
  </div>
{:else if $movie}
  <MovieHeader movie={$movie} on:play={handlePlay} />

  <div class="pt-8 page-padding v-stack space-y-8">
    <div class="w-full max-width space-y-8">
      {#if $movie.videos.length > 0}
        <MovieSection title={$_('page.movie.videoSection.title')}>
          <div class="w-full">
            <MovieTrailers movieVideos={$movie.videos} />
          </div>
        </MovieSection>
      {/if}

      <MovieSection title={$_('page.movie.directorSection.title')}>
        <div class="w-full">
          <div class="h-stack items-start flex-wrap">
            <div class="m-4">
              <MovieCharacter character={$movie.director} />
            </div>
          </div>
        </div>
      </MovieSection>

      <MovieSection title={$_('page.movie.actorsSection.title')}>
        <div class="w-full">
          <div class="h-stack items-start flex-wrap">
            {#each $movie.actors as actor}
              <div class="m-4">
                <MovieCharacter character={actor} role={actor.character} />
              </div>
            {/each}
          </div>
        </div>
      </MovieSection>

      <MovieSegmentedSection bind:movie />
    </div>
  </div>

  <Footer />

  {#if isPlayerVisible}
    <MoviePlayer bind:movie {torrent} on:close={() => (isPlayerVisible = false)} />
  {/if}
{/if}
