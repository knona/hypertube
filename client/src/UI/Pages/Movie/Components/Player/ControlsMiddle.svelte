<script lang="ts">
  import Icon from '../../../../Components/Icon/Icon.svelte';
  import { IconType } from '../../../../Components/Icon/Models/IconType';
  import LoadingIndicator from '../../../../Components/LoadingIndicator/LoadingIndicator.svelte';

  export let paused: boolean;
  export let loading: boolean;
  export let time: number;
  export let movieRuntime: number;

  function rewind(event: MouseEvent): void {
    event.stopPropagation();
    if (time <= 10) {
      time = 0;
    } else {
      time -= 10;
    }
  }

  function forward(event: MouseEvent): void {
    event.stopPropagation();
    if (time >= movieRuntime - 10) {
      time = movieRuntime;
    } else {
      time += 10;
    }
  }
</script>

<div class="absolute-center center-content space-x-6 md:space-x-16 h-min w-min">
  {#if !loading}
    <div class="h-stack items-center player-button h-8 w-8 md:h-10 md:w-10" on:mousedown={rewind}>
      <Icon type={IconType.backward} />
    </div>
    <div class="center-content">
      {#if paused}
        <div class="center-content player-button h-16 w-16 md:h-24 md:w-24">
          <Icon type={IconType.play} />
        </div>
      {/if}

      {#if !paused}
        <div class="center-content player-button h-16 w-16 md:h-24 md:w-24">
          <Icon type={IconType.pause} />
        </div>
      {/if}
    </div>
    <div class="center-content player-button h-8 w-8 md:h-10 md:w-10" on:mousedown={forward}>
      <Icon type={IconType.forward} />
    </div>
  {/if}

  {#if loading}
    <div class="w-full vstack items-center opacity-80">
      <LoadingIndicator showText={false} size="60" />
    </div>
  {/if}
</div>

<style>
  .h-min {
    height: -webkit-min-content;
    height: -moz-min-content;
    height: min-content;
  }
</style>
