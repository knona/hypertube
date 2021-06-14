<script lang="ts">
  import { _ } from 'svelte-i18n';

  import { currentUserStore } from '../../../../Modules/Store/CurrentUser/CurrentUserStore';
  import { preferences } from '../../../../Modules/Store/Preference/PreferenceStore';
  import Collapse from '../../../Components/Collapse/Collapse.svelte';
  import EmptyView from '../../../Components/EmptyView/EmptyView.svelte';
  import MovieGrid from '../../../Components/MovieGrid/MovieGrid.svelte';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';

  function getFavorites(): void {
    currentUserStore.getFavoriteMovies($preferences.language);
  }
</script>

{#if $currentUserStore.user}
  <Collapse title={$_('page.currentUser.components.favorites.collapse.title')}>
    {#if $currentUserStore.user.favoriteMovies.length === 0}
      <EmptyView description={$_('page.currentUser.components.favorites.emptyView.description')} />
    {:else}
      <div>
        <MovieGrid movies={$currentUserStore.user.favoriteMovies} />
      </div>
    {/if}

    {#if $currentUserStore.favoriteMovies.hasData}
      <div class="w-full mt-4 v-stack items-center">
        <RoundedButton
          title={$_('page.currentUser.components.favorites.showMoreButton.title')}
          on:click={getFavorites}
        />
      </div>
    {/if}
  </Collapse>{/if}
