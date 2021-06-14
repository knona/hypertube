<script lang="ts">
  import type { YoutubeTrailer } from '../../../../Models/YoutubeTrailer';
  import YoutubeVideo from '../../../Components/YoutubeVideo/YoutubeVideo.svelte';

  export let movieVideos: YoutubeTrailer[];

  let selectedVideo: YoutubeTrailer = movieVideos[0];

  function selectVideo(video: YoutubeTrailer): void {
    selectedVideo = video;
  }
</script>

<div
  class="w-full flex flex-col items-stretch md:flex-row md:justify-items-stretch bg-secondary-bg rounded-lg overflow-hidden"
>
  <div class="overflow-x-auto md:flex-1">
    <div class="flex flex-row md:flex-col md:flex-1">
      {#each movieVideos as video}
        {#if video.key === selectedVideo.key}
          <button
            class="px-4 py-3 appearance-none text-left text-sm whitespace-nowrap md:whitespace-normal text-black font-semibold bg-white border-none"
            on:click={() => selectVideo(video)}>{video.name}</button
          >
        {:else}
          <button
            class="px-4 py-3 appearance-none text-left text-sm whitespace-nowrap md:whitespace-normal font-semibold bg-transparent border-none hover:bg-gray-800"
            on:click={() => selectVideo(video)}>{video.name}</button
          >
        {/if}
      {/each}
    </div>
  </div>

  <div id="youtube-container" class="relative w-full md:w-3/4 h-0">
    <YoutubeVideo videoId={selectedVideo.key} />
  </div>
</div>

<style>
  #youtube-container {
    padding-bottom: 56.25%;
  }
</style>
