<script lang="ts">
  import { BehaviorSubject, Subject } from 'rxjs';
  import { debounceTime, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
  import InfiniteScroll from '../../Components/InfiniteScroll/InfiniteScroll.svelte';
  import { fade } from 'svelte/transition';
  import type { Movie } from '../../../Models/Movie';
  import type { MovieGenre } from '../../../Models/MovieGenre';
  import type { ServerError } from '../../../Models/Server/Errors/ServerError';
  import { SearchOrder } from '../../../Modules/Search/Models/SearchOrder';
  import { SearchSort } from '../../../Modules/Search/Models/SearchSort';
  import SearchManager from '../../../Modules/Search/SearchManager';
  import { componentState } from '../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../Modules/Store/ComponentState/Models/State';
  import { infiniteMovieList } from '../../../Modules/Store/InfiniteMovieListStore/InfiniteMovieListStore';
  import { preferences } from '../../../Modules/Store/Preference/PreferenceStore';
  import type { Optional } from '../../../Shared/Types';
  import InfoMessage from '../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import MovieGrid from '../../Components/MovieGrid/MovieGrid.svelte';
  import Page from '../../Components/Page/Page.svelte';
  import SearchOptionsCollapse from './Components/SearchOptionsCollapse.svelte';
  import { _ } from 'svelte-i18n';
  import { onDestroy } from 'svelte';

  export let search: string;

  const searchBeahevior: BehaviorSubject<string> = new BehaviorSubject(search);
  let state: State<ServerError> = componentState({ current: ComponentStateType.loading });
  let searchList = infiniteMovieList();
  let query: string = '';
  let genre: Optional<MovieGenre> = undefined;
  let minRating: Optional<string> = undefined;
  let sort: SearchSort = SearchSort.TITLE;
  let order: SearchOrder = SearchOrder.ASC;
  let isLoadingMoreMovies: boolean = false;
  const destroy$: Subject<void> = new Subject();

  function getSearchResults(fromInfiniteScrolling: boolean = false, fromOptionChange: boolean = false): void {
    if (query.length === 0 || (!$searchList.hasData && !fromOptionChange)) {
      return;
    }
    if (!fromInfiniteScrolling) {
      searchList.reset();
      state.setLoading();
    }
    isLoadingMoreMovies = true;
    SearchManager.search(
      {
        queryTerm: query,
        genre: genre,
        minRating: parseInt(minRating ?? '0') * 2,
        sortBy: sort,
        orderBy: order
      },
      $searchList.page,
      $preferences.language
    )
      .then((movies: Movie[]) => {
        state.setDefault();
        searchList.incrementPage();
        if (movies.length === 0) {
          searchList.hasNoMoreData();
        } else {
          if (fromInfiniteScrolling) {
            searchList.addMovies(movies);
          } else {
            searchList.setMovies(movies);
          }
        }
      })
      .catch(state.setError)
      .finally(() => {
        isLoadingMoreMovies = false;
      });
  }

  searchBeahevior
    .pipe(
      tap((searchString: string) => {
        if (searchString.length === 0) {
          searchList.reset();
        }
      }),
      filter((searchString: string) => searchString.length > 0),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => searchList.reset()),
      tap((typedSearch: string) => (query = typedSearch)),
      tap(() => getSearchResults()),
      takeUntil(destroy$)
    )
    .subscribe();

  $: searchBeahevior.next(search);

  $: {
    genre;
    minRating;
    sort;
    order;
    getSearchResults(false, true);
  }

  onDestroy(() => {
    destroy$.next();
    destroy$.complete();
  });
</script>

<div
  transition:fade={{ duration: 150 }}
  class="fixed top-0 left-0 z-30 w-screen h-screen pb-8 bg-bg bg-opacity-50 backdrop-filter backdrop-blur-xl overflow-y-auto"
>
  <Page>
    <div class="page-padding v-stack space-y-4">
      <SearchOptionsCollapse bind:genre bind:minRating bind:sort bind:order />

      {#if $state.current === ComponentStateType.loading}
        <div class="h-40 v-stack items-center justify-center">
          <LoadingIndicator />
        </div>
      {:else if $state.current === ComponentStateType.error}
        <div class="h-40 v-stack items-center justify-center">
          <InfoMessage type={InfoMessageType.error}>
            <LocalizedServerError serverError={$state.error} />
          </InfoMessage>
        </div>
      {:else if $searchList.movies.length === 0}
        <div class="h-40 v-stack center-content">
          <h2 class="text-2xl font-bold opacity-70">{$_('page.search.emptyView.description')}</h2>
        </div>
      {:else}
        <MovieGrid movies={$searchList.movies} />
      {/if}
    </div>
  </Page>
  <InfiniteScroll bind:isLoading={isLoadingMoreMovies} threshold={800} on:loadMore={() => getSearchResults(true)} />
</div>
