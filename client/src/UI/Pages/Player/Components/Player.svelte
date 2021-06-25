<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { fade } from 'svelte/transition';
  import type { DetailedMovie } from '../../../../Models/DetailedMovie';
  import { Language } from '../../../../Models/Language';
  import type { Torrent } from '../../../../Models/Torrent';
  import MovieManager from '../../../../Modules/Movie/MovieManager';
  import Navigation from '../../../../Modules/Navigation/Navigation';
  import type { MovieStore } from '../../../../Modules/Store/Movie/MovieStore.interface';
  import { token } from '../../../../Modules/Store/Token/TokenStore';
  import { subtitleUrl } from '../../../../Shared/Constants';
  import { torrentUrl } from '../../../../Utils/TorrentUtils';
  import type { MenuItem } from '../../../Components/Menu/Models/MenuItem';
  import PlayerControls from './../Components/PlayerControls.svelte';

  export let movie: MovieStore;
  export let torrent: Torrent;

  let currentTime: number = 0;
  let paused: boolean = false;
  let displayControls: boolean = true;
  let volume = 1;
  let muted: boolean = false;
  let loading: boolean = true;
  let videoElement: HTMLVideoElement;
  let availableLanguages: Language[] = [];
  let subtitlesMenuItems: MenuItem<string | null>[];
  $: {
    subtitlesMenuItems = [
      { value: null, render: () => $_('page.movie.components.player.moviePlayer.noSubtitle') as string }
    ];
    subtitlesMenuItems = subtitlesMenuItems.concat(
      availableLanguages.map(language => ({
        value: language,
        render: () => $_(`languages.${language}`) as string
      }))
    );
  }

  $: setMovieAsWatched(currentTime);

  const setMovieAsWatched: (time: number) => Promise<void> = (() => {
    let requestLoading: boolean = false;
    return async (time: number): Promise<void> => {
      if ($movie) {
        if (!$movie.isWatched && !requestLoading) {
          const runtime: number = $movie.runtime * 60;
          if (time / runtime > 0.85) {
            requestLoading = true;
            try {
              const { tmdbId, isWatched } = await MovieManager.setMovieAsWatched($movie.tmdbId);
              if (tmdbId === $movie.tmdbId) {
                movie.update((updatedMovie: DetailedMovie) => ({ ...updatedMovie, isWatched }));
              }
            } catch (error) {
              //
            }
            requestLoading = false;
          }
        }
      }
    };
  })();

  function getSubtitleUrl(language: Language): string {
    return `${subtitleUrl}?language=${language}&imdbId=${$movie?.imdbId as string}&token=${token.getString()}`;
  }

  function checkAvailableLanguages(): void {
    Object.values(Language).forEach(async language => {
      try {
        const res = await fetch(getSubtitleUrl(language));
        if (res.status === 200) {
          availableLanguages = [...availableLanguages, language];
        }
      } catch (_error) {
        //
      }
    });
  }

  onMount(() => {
    checkAvailableLanguages();
    paused = false;
    paused = true;
  });

  const hideControls: () => void = (() => {
    let timeoutId: number;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => (displayControls = false), 3000);
    };
  })();

  function handleMouseDown(event: MouseEvent): void {
    if (event.button === 0) {
      paused = !paused;
      displayControls = true;
    }
  }

  function handleMouseLeave(): void {
    displayControls = false;
  }

  function handleMouseMove(): void {
    displayControls = true;
  }

  function handleWaiting(): void {
    displayControls = true;
    loading = true;
  }

  function handleCanPlay(): void {
    loading = false;
  }

  function handleClose(): void {
    Navigation.navigateTo(`movie/${$movie?.tmdbId as number}`);
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->

<div transition:fade={{ duration: 150 }} class="fixed top-0 left-0 z-50 w-screen h-screen bg-black select-none">
  <div
    class="h-full w-full relative v-stack justify-center"
    style="cursor: {displayControls ? 'default' : 'none'};"
    on:mouseleave={handleMouseLeave}
    on:mousemove={handleMouseMove}
    on:mousedown={handleMouseDown}
  >
    <video
      bind:this={videoElement}
      class="py-4"
      src={torrentUrl(torrent.hash, token.getString())}
      width="100%"
      autoplay
      crossorigin="use-credentials"
      bind:currentTime
      bind:paused
      bind:volume
      bind:muted
      on:playing={hideControls}
      on:waiting={handleWaiting}
      on:canplay={handleCanPlay}
    >
      {#each availableLanguages as language}
        <track src={getSubtitleUrl(language)} srclang={language} label={$_(`languages.${language}`)} kind="subtitles" />
      {/each}
    </video>

    {#if displayControls || loading || paused}
      <PlayerControls
        bind:time={currentTime}
        bind:volume
        bind:muted
        {paused}
        {loading}
        movieTitle={$movie?.title ?? ''}
        movieRuntime={($movie?.runtime ?? 0) * 60}
        {subtitlesMenuItems}
        {videoElement}
        on:close={handleClose}
      />
    {/if}
  </div>
</div>
