<script lang="ts">
  import Button from './../Button/Button.svelte';
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import type { Dispatch, Optional } from '../../../Shared/Types';
  import { clickOutside } from '../../../Utils/ClickOutsideUtils';
  import type { IconType } from '../Icon/Models/IconType';
  import type { MenuItem } from '../Menu/Models/MenuItem';
  import RoundedButton from '../RoundedButton/RoundedButton.svelte';
  import { MenuButtonPosition } from './Models/MenuButtonPosition';
  import { MenuButtonType } from './Models/MenuButtonType';

  export let title: Optional<string> = undefined;
  export let icon: Optional<IconType> = undefined;
  export let backgroundColor: string = 'ctrl-bg';
  export let textColor: string = 'black';
  export let spacing: number = 1;
  export let horizontalPadding: number = 8;
  export let verticalPadding: number = 1.5;
  export let menuWidth: number = 72;
  export let menuPosition: MenuButtonPosition = MenuButtonPosition.bottomRight;
  export let items: MenuItem<any>[];
  export let offset: number = 10;
  export let buttonType: MenuButtonType = MenuButtonType.rounded;
  export let textStyle: string = '';

  const dispatch: Dispatch<string> = createEventDispatcher<string>();
  let isMenuVisible: boolean = false;

  function onItemSelection(item: MenuItem<any>): void {
    dispatch('itemSelection', item.value);
    isMenuVisible = false;
  }

  function cssPosition(position: MenuButtonPosition): string {
    switch (position) {
      case MenuButtonPosition.topLeft:
        return `bottom-${offset} left-0`;
      case MenuButtonPosition.topRight:
        return `bottom-${offset} right-0`;
      case MenuButtonPosition.bottomRight:
        return `top-${offset} right-0`;
      case MenuButtonPosition.bottomLeft:
        return `top-${offset} left-0`;
    }
  }

  function yTranslation(position: MenuButtonPosition): number {
    switch (position) {
      case MenuButtonPosition.topLeft:
      case MenuButtonPosition.topRight:
        return offset;
      case MenuButtonPosition.bottomRight:
      case MenuButtonPosition.bottomLeft:
        return -offset;
    }
  }
</script>

<div class="relative h-stack justify-center">
  {#if buttonType === MenuButtonType.rounded}
    <RoundedButton
      {title}
      {icon}
      {backgroundColor}
      {textColor}
      {spacing}
      {horizontalPadding}
      {verticalPadding}
      scaleEffect={false}
      {textStyle}
      on:click={() => (isMenuVisible = true)}
    />
  {:else if buttonType === MenuButtonType.normal}
    <Button {title} {icon} {spacing} on:click={() => (isMenuVisible = true)} />
  {/if}

  {#if isMenuVisible}
    <div
      class={`absolute ${cssPosition(menuPosition)} z-40 bg-white rounded-lg`}
      use:clickOutside
      on:clickOutside={() => (isMenuVisible = false)}
      transition:fly={{ y: yTranslation(menuPosition), duration: 150 }}
    >
      <div class="w-{menuWidth} text-{textColor} bg-{backgroundColor} rounded-full p-2">
        {#each items as item}
          <button
            class="w-full px-4 py-2 text-sm text-left font-semibold appearance-none border-none bg-transparent rounded-md hover:bg-gray-200"
            on:click={() => onItemSelection(item)}
          >
            {@html item.render()}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
