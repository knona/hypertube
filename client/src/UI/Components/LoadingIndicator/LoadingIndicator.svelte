<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { Circle } from 'svelte-loading-spinners';
  import type { Optional } from '../../../Shared/Types';

  export let showText: boolean = true;
  export let text: Optional<string> = undefined;
  export let size: string = '20';
</script>

<div class="h-stack space-x-2 items-center">
  <Circle {size} unit="px" color="white" duration="1s" />
  {#if showText}
    <div class="opacity-50">{text === undefined ? $_('component.loadingIndicator.loading') : text}</div>
  {/if}
</div>
