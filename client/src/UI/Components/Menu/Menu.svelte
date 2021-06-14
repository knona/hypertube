<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { Optional } from '../../../Shared/Types';
  import type { MenuItem } from './Models/MenuItem';

  export let items: MenuItem<any>[];
  export let selectedItem: Optional<MenuItem<any>> = undefined;
  export let allowUndefined: boolean = false;
  export let textColor: string = 'black';
  export let backgroundColor: string = 'white';
  export let leftPadding: number = 4;
  export let rightPadding: number = 8;
  export let topPadding: number = 1.5;
  export let bottomPadding: number = 1.5;
  export let rounded: string = 'full';
</script>

<select
  class={`form-select pl-${leftPadding.toString()} cursor-pointer pr-${rightPadding} pt-${topPadding} pb-${bottomPadding}
  flex-1 text-${textColor} text-sm font-semibold bg-${backgroundColor} border-none rounded-${rounded}`}
  bind:value={selectedItem}
>
  {#if allowUndefined}
    <option class="option-color" value={undefined} selected={selectedItem === undefined}>
      {$_('component.menu.undefinedOption')}
    </option>
  {/if}
  {#each items as item}
    <option class="option-color" value={item} selected={item.value === selectedItem?.value}>
      {@html item.render()}
    </option>
  {/each}
</select>

<style>
  .option-color {
    color: initial;
  }
</style>
