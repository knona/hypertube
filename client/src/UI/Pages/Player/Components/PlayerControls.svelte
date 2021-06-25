<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { MenuItem } from '../../../Components/Menu/Models/MenuItem';
  import PlayerControlsBottom from './PlayerControlsBottom.svelte';
  import PlayerControlsMiddle from './PlayerControlsMiddle.svelte';
  import PlayerControlsTop from './PlayerControlsTop.svelte';

  export let time: number;
  export let volume: number;
  export let muted: boolean;
  export let paused: boolean;
  export let loading: boolean;
  export let movieTitle: string;
  export let movieRuntime: number;
  export let subtitlesMenuItems: MenuItem<string | null>[];
  export let videoElement: HTMLVideoElement;
</script>

<div transition:fade={{ duration: 150 }}>
  <PlayerControlsTop {movieTitle} on:close />
  <PlayerControlsMiddle bind:time {movieRuntime} {paused} {loading} />
  <PlayerControlsBottom bind:time bind:volume bind:muted {movieRuntime} {videoElement} {subtitlesMenuItems} />
</div>
