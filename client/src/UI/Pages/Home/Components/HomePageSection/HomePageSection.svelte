<script lang="ts">
  import { onMount } from 'svelte';
  import type { ServerError } from '../../../../../Models/Server/Errors/ServerError';
  import HomeLayoutManager from '../../../../../Modules/Home/HomeLayoutManager';
  import { componentState } from '../../../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../../../Modules/Store/ComponentState/Models/State';
  import { popularHomePageLayout, topRatedHomePageLayout } from '../../../../../Modules/Store/Home/HomePageLayoutStore';
  import type { HomePageLayoutStore } from '../../../../../Modules/Store/Home/HomePageLayoutStore.interface';
  import { preferences } from '../../../../../Modules/Store/Preference/PreferenceStore';
  import InfoMessage from '../../../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import MovieGrid from '../../../../Components/MovieGrid/MovieGrid.svelte';
  import MovieCarousel from '../MovieCarousel.svelte';
  import InfiniteScroll from './../../../../Components/InfiniteScroll/InfiniteScroll.svelte';
  import { HomePageSectionType } from './Models/HomePageSectionType';

  export let type: HomePageSectionType;

  let state: State<ServerError> = componentState({ current: ComponentStateType.loading });
  let layout: HomePageLayoutStore = defaultLayout();
  let isLoadingMoreMovies: boolean = false;

  function defaultLayout(): HomePageLayoutStore {
    switch (type) {
      case HomePageSectionType.popular:
        return popularHomePageLayout;
      case HomePageSectionType.topRated:
        return topRatedHomePageLayout;
    }
  }

  function getLayout(): void {
    if ($layout.content.length === 0) {
      state.setLoading();
    }

    switch (type) {
      case HomePageSectionType.popular:
        HomeLayoutManager.getPopular($preferences.language)
          .then(() => {
            layout = popularHomePageLayout;
            state.setDefault();
            return;
          })
          .catch(state.setError);
        break;
      case HomePageSectionType.topRated:
        HomeLayoutManager.getTopRated()
          .then(() => {
            layout = topRatedHomePageLayout;
            state.setDefault();
            return;
          })
          .catch(state.setError);
        break;
    }
  }

  function getMoreLayout(): void {
    let getMoreMovies: () => Promise<void>;
    switch (type) {
      case HomePageSectionType.popular:
        getMoreMovies = HomeLayoutManager.getMorePopular.bind(null, $preferences.language) as () => Promise<void>;
        break;
      case HomePageSectionType.topRated:
        getMoreMovies = HomeLayoutManager.getMoreTopRated;
        break;
    }
    isLoadingMoreMovies = true;
    getMoreMovies()
      .then(state.setDefault)
      .catch(state.setError)
      .finally(() => {
        isLoadingMoreMovies = false;
      });
  }

  onMount(() => {
    if ($layout.content.length === 0) {
      getLayout();
    }
  });

  $: {
    type;
    getLayout();
  }
</script>

{#if $state.current === ComponentStateType.loading}
  <div class="w-screen h-screen v-stack items-center justify-center">
    <LoadingIndicator />
  </div>
{:else if $state.current === ComponentStateType.error}
  <div class="w-screen h-screen v-stack items-center justify-center">
    <InfoMessage type={InfoMessageType.error}>
      <LocalizedServerError serverError={$state.error} />
    </InfoMessage>
  </div>
{:else}
  <MovieCarousel movies={$layout.headers} />
  <div class="pt-8 page-padding">
    <MovieGrid movies={$layout.content} />
  </div>

  <InfiniteScroll useWindow={true} bind:isLoading={isLoadingMoreMovies} threshold={800} on:loadMore={getMoreLayout} />
{/if}
