<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { MenuItem } from '../../../../Components/Menu/Models/MenuItem';
  import ControlsBottom from './ControlsBottom.svelte';
  import ControlsTop from './ControlsTop.svelte';
  import ControlsMiddle from './ControlsMiddle.svelte';

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
  <ControlsTop {movieTitle} on:close />

  <ControlsMiddle bind:time {movieRuntime} {paused} {loading} />

  <ControlsBottom bind:time bind:volume bind:muted {movieRuntime} {videoElement} {subtitlesMenuItems} />
</div>
