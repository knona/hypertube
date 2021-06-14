<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { MovieStore } from '../../../../Modules/Store/Movie/MovieStore.interface';
  import type { SegmentedControlSegment } from '../../../Components/SegementedControl/Models/SegmentedControlSegment';
  import SegmentedControl from '../../../Components/SegementedControl/SegmentedControl.svelte';
  import { AllMoviePageSection, MoviePageSection } from '../Models/MoviePageSection';
  import MovieComments from './MovieComments.svelte';
  import MovieRecommendations from './MovieRecommendations.svelte';
  import MovieSection from './MovieSection.svelte';

  export let movie: MovieStore;

  let selectedSegment: SegmentedControlSegment<MoviePageSection> = segments()[0];

  function segments(): SegmentedControlSegment<MoviePageSection>[] {
    return AllMoviePageSection.map(section => ({
      value: section,
      localized: $_(`page.movie.components.segmentedSection.segmentedControl.${section}`) as string
    }));
  }
</script>

<div class="v-stack items-center">
  <SegmentedControl segments={segments()} bind:selectedSegment />
</div>

{#if selectedSegment.value === MoviePageSection.recommendations}
  <MovieSection>
    <MovieRecommendations movieId={$movie?.tmdbId.toString() ?? ''} />
  </MovieSection>
{:else if selectedSegment.value === MoviePageSection.comments}
  <MovieSection>
    <MovieComments bind:movie />
  </MovieSection>
{/if}
