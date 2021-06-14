<script lang="ts">
  import type { Optional } from '../../../Shared/Types';

  export let className: string = '';
  export let src: Optional<string>;
  export let alt: string = '';
  export { className as class };

  let isImageDisplayed: boolean = src !== null;

  function onError(): void {
    isImageDisplayed = false;
  }
</script>

{#if isImageDisplayed}
  <img class={className} {src} {alt} on:error={onError} />
{:else}
  <slot />
{/if}
