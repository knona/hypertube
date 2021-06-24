<script lang="ts">
  import { formatTime, parseTextTrackList } from '../../../../Utils/PlayerUtils';
  import { IconType } from '../../../Components/Icon/Models/IconType';
  import Button from './../../../Components/Button/Button.svelte';
  import type { MenuItem } from './../../../Components/Menu/Models/MenuItem';
  import MenuButton from './../../../Components/MenuButton/MenuButton.svelte';
  import { MenuButtonPosition } from './../../../Components/MenuButton/Models/MenuButtonPosition';
  import { MenuButtonType } from './../../../Components/MenuButton/Models/MenuButtonType';
  import PlayerVideoProgress from './PlayerVideoProgress.svelte';
  import PlayerVolumeProgress from './PlayerVolumeProgress.svelte';

  export let time: number;
  export let volume: number;
  export let muted: boolean;
  export let movieRuntime: number;
  export let videoElement: HTMLVideoElement;
  export let subtitlesMenuItems: MenuItem<string | null>[];

  let prevVolume = volume;

  $: {
    if (prevVolume !== volume && volume !== 0) {
      muted = false;
    }
    if (prevVolume !== volume && volume < 0.075) {
      muted = true;
      volume = 0;
    }
    prevVolume = volume;
  }

  function stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  async function handleFullscreen(): Promise<void> {
    if (document.fullscreenElement !== null) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }

  function handleMute(): void {
    muted = !muted;
  }

  function changeSubtitles(event: CustomEvent<string | null>): void {
    const subtitle: string | null = event.detail;

    for (const videoTrack of parseTextTrackList(videoElement.textTracks)) {
      if (subtitle && subtitle === videoTrack.language) {
        videoTrack.mode = 'showing';
      } else {
        videoTrack.mode = 'disabled';
      }
    }
  }
</script>

<div
  class="absolute bottom-0 pb-5 px-5 w-full v-stack items-center bg-gradient-to-t from-black"
  on:mousedown={stopPropagation}
>
  <PlayerVideoProgress bind:time duration={movieRuntime} />
  <div class="h-stack items-center justify-between w-full px-1">
    <div>
      <span class="text-sm md:text-lg text-white">{formatTime(time)}</span>
      <span class="text-sm md:text-lg text-gray-500">/ {formatTime(movieRuntime)}</span>
    </div>

    <div class="h-stack items-center space-x-5">
      <div class="h-stack items-center space-x-2 player-button">
        {#if muted}
          <Button icon={IconType.volumeOff} on:click={handleMute} />
        {:else}
          <Button icon={IconType.volumeUp} on:click={handleMute} />
        {/if}
        <PlayerVolumeProgress disabled={muted} bind:volume />
      </div>

      <div class="center-content player-button">
        <Button icon={IconType.fullscreen} on:click={handleFullscreen} />
      </div>

      <div class="center-content player-button">
        <MenuButton
          icon={IconType.subtitles}
          items={subtitlesMenuItems}
          menuWidth={60}
          menuPosition={MenuButtonPosition.topRight}
          buttonType={MenuButtonType.normal}
          offset={16}
          on:itemSelection={changeSubtitles}
        />
      </div>
    </div>
  </div>
</div>
