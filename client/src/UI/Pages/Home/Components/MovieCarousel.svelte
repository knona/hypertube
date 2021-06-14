<script lang="ts">
  import { interval, Subject, Subscription } from 'rxjs';
  import { takeUntil, tap } from 'rxjs/operators';
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import type { Movie } from '../../../../Models/Movie';
  import Navigation from '../../../../Modules/Navigation/Navigation';
  import { carouselInterval } from '../../../../Shared/Constants';
  import type { Optional } from '../../../../Shared/Types';
  import Divider from '../../../Components/Divider/Divider.svelte';

  export let movies: Movie[];

  const destroy$: Subject<void> = new Subject();
  const animationParameters: { duration: number } = { duration: 1000 };
  let intervalSubscription: Optional<Subscription>;
  let currentIndex: number = 0;
  let currentMovie: Movie = movies[0];

  function setInterval(): void {
    intervalSubscription?.unsubscribe();
    currentIndex = 0;
    currentMovie = movies[0];
    intervalSubscription = interval(carouselInterval)
      .pipe(
        tap(() => {
          currentIndex = currentIndex < movies.length - 1 ? currentIndex + 1 : 0;
        }),
        tap(() => (currentMovie = movies[currentIndex])),
        takeUntil(destroy$)
      )
      .subscribe();
  }

  function goToMovie(): void {
    Navigation.navigateTo(`/movie/${currentMovie.tmdbId}`);
  }

  $: {
    movies;
    setInterval();
  }

  onDestroy(() => {
    destroy$.next();
    destroy$.complete();
  });
</script>

<div id="background-gradient" class="absolute top-0 left-0 right-0 bottom-0">
  {#key currentMovie.tmdbId}
    <img
      in:fade={animationParameters}
      out:fade|local={animationParameters}
      class="absolute top-0 left-0 w-screen h-screen object-cover"
      src={currentMovie.backdropUrl}
      alt=""
    />
  {/key}
  <div class="absolute top-0 left-0 w-full h-screen backdrop-filter backdrop-blur-xl" />
  <div class="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-transparent to-bg" />
</div>

<div class="page-padding">
  <div class="max-width">
    <button class="m-0 p-0 appearance-none border-none bg-transparent" on:click={goToMovie}>
      <div class="relative rounded-xl overflow-hidden bg-secondary-bg">
        <img class="w-full opacity-0" src={currentMovie.backdropUrl} alt="" />
        {#key currentMovie.tmdbId}
          <img
            in:fade={animationParameters}
            out:fade|local={animationParameters}
            class="absolute top-0 left-0 right-0 bottom-0"
            src={currentMovie.backdropUrl}
            alt=""
          />
        {/key}

        {#key currentMovie.tmdbId}
          <div
            in:fade={animationParameters}
            out:fade|local={animationParameters}
            class="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-bg to-transparent"
          >
            <div class="p-4 md:p-6 v-stack space-y-2">
              <h1 class="text-xl md:text-4xl text-left font-bold">{currentMovie.title}</h1>

              <div class="hidden md:block">
                <Divider />
              </div>

              <div class="hidden md:block">
                <h2 class="text-sm text-left">{currentMovie.overview}</h2>
              </div>
            </div>
          </div>
        {/key}
      </div>
    </button>
  </div>
</div>

<style>
  button:active {
    background-color: transparent;
  }

  #background-gradient {
    z-index: -10;
  }
</style>
