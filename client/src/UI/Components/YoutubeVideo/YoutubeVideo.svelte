<script lang="ts">
  import { onMount } from 'svelte';
  import type { Optional } from '../../../Shared/Types';

  export let videoId: string;

  let iFrame: Optional<HTMLIFrameElement>;

  function setUrl(url: string): void {
    if (iFrame) {
      iFrame.contentWindow?.location.replace(`//www.youtube.com/embed/${url}`);
    }
  }

  onMount(() => {
    setUrl(videoId);
  });

  $: {
    videoId;
    setUrl(videoId);
  }
</script>

<iframe
  class="absolute top-0 left-0 w-full h-full"
  frameborder="0"
  title="youtube"
  allowfullscreen
  bind:this={iFrame}
/>
