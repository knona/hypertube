<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Dispatch, Optional } from '../../../Shared/Types';
  import Icon from '../Icon/Icon.svelte';
  import type { IconType } from '../Icon/Models/IconType';

  export let title: Optional<string> = undefined;
  export let icon: Optional<IconType> = undefined;
  export let spacing: number = 1;
  export let disabled: boolean = false;

  const dispatch: Dispatch<string> = createEventDispatcher<string>();
  let click: () => void = () => dispatch('click');
</script>

<button class="space-x-2 bg-transparent border-none cursor-pointer" {disabled} on:click={click}>
  <div class={`h-stack items-center justify-center justify-items-center space-x-${spacing}`}>
    {#if icon}
      <div class="w-5 h-5">
        <Icon type={icon} />
      </div>
    {/if}
    {#if title}
      <h3>{title}</h3>
    {/if}
  </div>
</button>

<style>
  button:active {
    background-color: transparent;
  }
</style>
