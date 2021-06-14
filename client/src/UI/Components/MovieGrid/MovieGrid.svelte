<script lang="ts">
  import type { Movie } from '../../../Models/Movie';
  import MovieThumbnail from '../MovieThumbnail/MovieThumbnail.svelte';

  export let movies: Movie[];
  export let watchedBadge: boolean = true;
</script>

<div id="movie-grid" class="grid gap-4 md:gap-8">
  {#each movies as movie}
    <MovieThumbnail {movie} {watchedBadge} />
  {/each}
</div>

<style>
  #movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  @media (min-width: 768px) {
    #movie-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
  }
</style>
