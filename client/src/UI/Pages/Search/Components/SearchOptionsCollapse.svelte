<script lang="ts">
  import { _ } from 'svelte-i18n';

  import { AllMovieGenre, MovieGenre } from '../../../../Models/MovieGenre';
  import { AllSearchOrder, SearchOrder } from '../../../../Modules/Search/Models/SearchOrder';
  import { AllSearchSort, SearchSort } from '../../../../Modules/Search/Models/SearchSort';
  import type { Optional } from '../../../../Shared/Types';
  import { nArray } from '../../../../Utils/ArrayUtils';
  import Collapse from '../../../Components/Collapse/Collapse.svelte';
  import SearchOption from './SearchOption.svelte';

  export let genre: Optional<MovieGenre> = undefined;
  export let minRating: Optional<string> = undefined;
  export let sort: SearchSort = SearchSort.TITLE;
  export let order: SearchOrder = SearchOrder.ASC;

  let isCollapsed: boolean = false;
</script>

<Collapse title={$_('page.search.components.optionsCollapse.collapse.title')} bind:isCollapsed>
  <div
    id="options-grid"
    class="p-6 w-full grid gap-8 bg-black bg-opacity-20 rounded-xl border border-white border-opacity-10"
  >
    <SearchOption
      title={$_('page.search.components.optionsCollapse.genre')}
      items={AllMovieGenre}
      allowUndefined={true}
      localizationPrefix="movieGenre"
      bind:selectedOption={genre}
    />
    <SearchOption
      title={$_('page.search.components.optionsCollapse.minRating')}
      items={nArray(4).map(n => (n + 1).toString())}
      allowUndefined={true}
      bind:selectedOption={minRating}
    />
    <SearchOption
      title={$_('page.search.components.optionsCollapse.sortBy')}
      items={AllSearchSort}
      localizationPrefix="searchSort"
      bind:selectedOption={sort}
    />
    <SearchOption
      title={$_('page.search.components.optionsCollapse.orderBy')}
      items={AllSearchOrder}
      localizationPrefix="searchOrder"
      bind:selectedOption={order}
    />
  </div>
</Collapse>

<style>
  #options-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
</style>
