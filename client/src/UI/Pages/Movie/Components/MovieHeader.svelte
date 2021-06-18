<script lang="ts">
  import dayjs from 'dayjs';
  import 'dayjs/locale/fr';
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { DetailedMovie } from '../../../../Models/DetailedMovie';
  import type { Torrent } from '../../../../Models/Torrent';
  import MovieManager from '../../../../Modules/Movie/MovieManager';
  import type { Dispatch } from '../../../../Shared/Types';
  import Icon from '../../../Components/Icon/Icon.svelte';
  import { IconType } from '../../../Components/Icon/Models/IconType';
  import type { MenuItem } from '../../../Components/Menu/Models/MenuItem';
  import MenuButton from '../../../Components/MenuButton/MenuButton.svelte';
  import { MenuButtonPosition } from '../../../Components/MenuButton/Models/MenuButtonPosition';
  import OptionalImage from '../../../Components/OptionalImage/OptionalImage.svelte';
  import StarRating from '../../../Components/StarRating/StarRating.svelte';
  import WatchedBadge from '../../../Components/WatchedBadge/WatchedBadge.svelte';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import { preferences } from '../../../../Modules/Store/Preference/PreferenceStore';

  export let movie: DetailedMovie;

  const dispatch: Dispatch<string> = createEventDispatcher<string>();

  function play(event: CustomEvent<Torrent>): void {
    const torrent: Torrent = event.detail;
    dispatch('play', torrent);
  }

  function favoriteClicked(): void {
    if (movie.isFavorite) {
      removeFromFavorites();
    } else {
      addToFavorites();
    }
  }

  function addToFavorites(): void {
    MovieManager.addToFavorites(movie.tmdbId.toString()).then(() => (movie = { ...movie, isFavorite: true }));
  }

  function removeFromFavorites(): void {
    MovieManager.removeFavorites(movie.tmdbId.toString()).then(() => (movie = { ...movie, isFavorite: false }));
  }

  function menuItemForTorrent(torrent: Torrent): MenuItem<Torrent> {
    return {
      value: torrent,
      render: () => `
      <div class="v-stack items-start">
        <h3>${torrent.quality}</h3>
        <div class="v-stack items-start text-xs text-secondary-text">
          <h4>${torrent.seeds} seeds</h4>
          <h4>${torrent.peers} peers</h4>
        <div>
      </div>
      `
    };
  }

  function playMenuItems(): MenuItem<Torrent>[] {
    return movie.torrents.map(menuItemForTorrent);
  }

  function formattedReleaseDate(): string {
    dayjs.extend(localizedFormat);
    return dayjs(movie.releaseDate).locale($preferences.language).format('LL');
  }
</script>

<div id="movie-backdrop" class="relative w-full pt-32 md:pt-0">
  <div id="movie-image" class="overflow-hidden">
    <OptionalImage class="w-full object-cover object-center" src={movie.backdropUrl} alt="Movie backdrop">
      <div id="movie-image-placeholder" class="relative bg-secondary-bg overflow-hidden">
        <img class="w-full object-cover" src={movie.posterUrl} alt="Movie poster" />
        <div class="absolute top-0 left-0 right-0 bottom-0 backdrop-filter backdrop-blur-xl" />
      </div>
    </OptionalImage>
  </div>

  <div class="pt-6 md:pt-0 md:absolute left-0 right-0 bottom-0 page-padding bg-gradient-to-t from-bg to-transparent">
    <div class="max-width v-stack space-y-3">
      <div class="h-stack items-center justify-between">
        <div class="v-stack items-start space-y-2">
          {#if movie.isWatched}
            <WatchedBadge />
          {/if}

          <h2 class="text-4xl font-bold">{movie.title}</h2>

          <div class="h-stack items-start space-x-2">
            {#each movie.genres as genre}
              <div class="text-xs font-light">{genre}</div>
            {/each}
          </div>

          <StarRating rating={movie.voteAverage} size={15} />
        </div>

        <div class="flex-shrink-0 hidden md:block">
          <div class="v-stack items-center space-y-2">
            <MenuButton
              title={$_('page.movie.components.header.playButton.title')}
              icon={IconType.play}
              items={playMenuItems()}
              menuWidth={60}
              menuPosition={MenuButtonPosition.bottomRight}
              disabled={movie.torrents.length === 0}
              on:itemSelection={play}
            />
            <button class="appearence-none bg-transparent border-none" on:click={favoriteClicked}>
              <div class="h-stack items-center space-x-2">
                <div class="w-4 h-4">
                  {#if movie.isFavorite}
                    <Icon type={IconType.checkmark} />
                  {:else}
                    <Icon type={IconType.heart} />
                  {/if}
                </div>
                {#if movie.isFavorite}
                  <h4 class="text-xs">{$_('page.movie.components.header.favoriteButton.isFavorite')}</h4>
                {:else}
                  <h4 class="text-xs">{$_('page.movie.components.header.favoriteButton.isNotFavorite')}</h4>
                {/if}
              </div>
            </button>
          </div>
        </div>
      </div>

      <hr class="opacity-10" />

      <div class="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-between">
        <h3 class="text-sm">{movie.overview}</h3>

        <div class="md:ml-4 v-stack items-start md:items-end">
          <div class="text-sm text-secondary-text whitespace-nowrap">{$_('page.movie.components.header.released')}</div>
          <div class="text-sm whitespace-nowrap">{formattedReleaseDate()}</div>
        </div>

        <div class="v-stack items-end md:hidden">
          <div class="v-stack items-center space-y-2">
            <MenuButton
              title={$_('page.movie.components.header.playButton.title')}
              icon={IconType.play}
              items={playMenuItems()}
              menuWidth={60}
              menuPosition={MenuButtonPosition.bottomRight}
              disabled={movie.torrents.length === 0}
              on:itemSelection={play}
            />
            <button class="appearence-none bg-transparent border-none" on:click={favoriteClicked}>
              <div class="h-stack items-center space-x-2">
                <div class="w-4 h-4">
                  {#if movie.isFavorite}
                    <Icon type={IconType.checkmark} />
                  {:else}
                    <Icon type={IconType.heart} />
                  {/if}
                </div>
                {#if movie.isFavorite}
                  <h4 class="text-xs">{$_('page.movie.components.header.favoriteButton.isFavorite')}</h4>
                {:else}
                  <h4 class="text-xs">{$_('page.movie.components.header.favoriteButton.isNotFavorite')}</h4>
                {/if}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  #movie-image,
  #movie-backdrop {
    max-height: 900px;
  }

  #movie-image-placeholder {
    height: 400px;
  }
</style>
