<script lang="ts">
  import { _ } from 'svelte-i18n';

  import { preferences } from '../../../../Modules/Store/Preference/PreferenceStore';

  import type { UserStore } from '../../../../Modules/Store/User/UserStore.interface';
  import Collapse from '../../../Components/Collapse/Collapse.svelte';
  import EmptyView from '../../../Components/EmptyView/EmptyView.svelte';
  import MovieGrid from '../../../Components/MovieGrid/MovieGrid.svelte';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';

  export let store: UserStore;

  function getFavorites(): void {
    store.getFavoriteMovies($preferences.language);
  }
</script>

{#if $store.user}
  <Collapse title={$_('page.user.components.favorites.collapse.title')}>
    {#if $store.user.favoriteMovies.length === 0}
      <EmptyView description={$_('page.user.components.favorites.emptyView.description')} />
    {:else}
      <div>
        <MovieGrid movies={$store.user.favoriteMovies} />
      </div>
    {/if}

    {#if $store.favoriteMovies.hasData}
      <div class="w-full mt-4 v-stack items-center">
        <RoundedButton title="Show more" on:click={getFavorites} />
      </div>
    {/if}
  </Collapse>
{/if}
