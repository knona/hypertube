<script lang="ts">
  import type { Movie } from '../../../Models/Movie';
  import Navigation from '../../../Modules/Navigation/Navigation';
  import OptionalImage from '../OptionalImage/OptionalImage.svelte';
  import StarRating from '../StarRating/StarRating.svelte';
  import WatchedBadge from '../WatchedBadge/WatchedBadge.svelte';

  export let movie: Movie;
  export let watchedBadge: boolean = true;

  let moviePosterImageWidth: number = 0;
  let moviePosterImage: HTMLDivElement;

  function goToMoviePage(): void {
    Navigation.navigateTo(`/movie/${movie.tmdbId}`);
  }

  $: if (moviePosterImage) {
    moviePosterImage.style.height = (moviePosterImageWidth * 1.5).toString() + 'px';
  }
</script>

<button
  class="relative v-stack justify-start appearance-none border-none transition-transform duration-300 transform hover:scale-105"
  on:click={goToMoviePage}
>
  {#if movie.isWatched && watchedBadge}
    <div class="absolute top-2 left-2 z-10">
      <WatchedBadge />
    </div>
  {/if}

  <div class="w-full v-stack items-start space-y-2">
    <div
      class="w-full bg-secondary-bg rounded-md overflow-hidden"
      bind:clientWidth={moviePosterImageWidth}
      bind:this={moviePosterImage}
    >
      <OptionalImage class="w-full h-full object-cover" src={movie.posterUrl} />
    </div>

    <div class="mt-2">
      <StarRating rating={movie.voteAverage} />
    </div>

    <div class="text-left text-sm md:text-lg font-semibold">
      {movie.title}
    </div>
  </div>
</button>

<style>
  button:active {
    background-color: transparent;
  }
</style>
