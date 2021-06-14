<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { currentUserStore } from '../../../../Modules/Store/CurrentUser/CurrentUserStore';
  import { preferences } from '../../../../Modules/Store/Preference/PreferenceStore';
  import Collapse from '../../../Components/Collapse/Collapse.svelte';
  import EmptyView from '../../../Components/EmptyView/EmptyView.svelte';
  import MovieGrid from '../../../Components/MovieGrid/MovieGrid.svelte';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';

  function getWatched(): void {
    currentUserStore.getWatchedMovies($preferences.language);
  }
</script>

{#if $currentUserStore.user}
  <Collapse title={$_('page.currentUser.components.watched.collapse.title')}>
    {#if $currentUserStore.user.watchedMovies.length === 0}
      <EmptyView description={$_('page.currentUser.components.watched.emptyView.description')} />
    {:else}
      <div>
        <MovieGrid movies={$currentUserStore.user.watchedMovies} watchedBadge={false} />
      </div>
    {/if}

    {#if $currentUserStore.watchedMovies.hasData}
      <div class="w-full mt-4 v-stack items-center">
        <RoundedButton title={$_('page.currentUser.components.watched.showMoreButton.title')} on:click={getWatched} />
      </div>
    {/if}
  </Collapse>
{/if}
