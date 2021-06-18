<script lang="ts">
  import type { Dispatch, Optional } from '../../../Shared/Types';
  import type { IconType } from '../Icon/Models/IconType';
  import Icon from '../Icon/Icon.svelte';
  import { createEventDispatcher } from 'svelte';

  export let title: Optional<string> = undefined;
  export let icon: Optional<IconType> = undefined;
  export let backgroundColor: string = 'ctrl-bg';
  export let textColor: string = 'black';
  export let spacing: number = 1;
  export let horizontalPadding: number = 8;
  export let verticalPadding: number = 1.5;
  export let scaleEffect: boolean = true;
  export let disabled: boolean = false;
  export let textStyle: string = '';

  const dispatch: Dispatch<string> = createEventDispatcher<string>();

  function click(): void {
    dispatch('click');
  }
</script>

<button
  class={`px-${horizontalPadding} py-${verticalPadding} text-${textColor}
  text-sm font-semibold tracking-wide bg-${backgroundColor} rounded-full
  appearance-none border-none active:opacity-40 disabled:opacity-20 disabled:bg-opacity-20 
  ransition-transorm duration-300 ${disabled ? 'cursor-default' : 'cursor-pointer'} ${
    scaleEffect && !disabled ? 'transform hover:scale-105' : ''
  } focus:outline-gray-50`}
  {disabled}
  on:click={click}
>
  <div class={`h-stack items-center justify-center justify-items-center space-x-${spacing}`}>
    {#if icon}
      <div class="w-5 h-5">
        <Icon type={icon} />
      </div>
    {/if}
    {#if title}
      <h3 class={textStyle}>{title}</h3>
    {/if}
  </div>

  <slot />
</button>
