<script lang="ts">
  import Button from './../../../../Components/Button/Button.svelte';
  import { IconType } from '../../../../Components/Icon/Models/IconType';
  import { createEventDispatcher } from 'svelte';
  import type { Dispatch } from '../../../../../Shared/Types';

  export let movieTitle: string;

  const dispatch: Dispatch<string> = createEventDispatcher<string>();

  function stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  async function handleClose(): Promise<void> {
    if (document.fullscreenElement !== null) {
      await document.exitFullscreen();
    }
    await new Promise(resolve => setTimeout(resolve));
    dispatch('close');
  }
</script>

<div
  class="px-5 pt-5 w-full top-0 absolute h-stack items-center justify-between bg-gradient-to-b from-black"
  on:mousedown={stopPropagation}
>
  <h2 class="text-3xl font-bold">{movieTitle}</h2>
  <div class="center-content player-button">
    <Button icon={IconType.close} on:click={handleClose} />
  </div>
</div>
