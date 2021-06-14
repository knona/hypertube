<script lang="ts">
  import Divider from '../Divider/Divider.svelte';
  import Icon from '../Icon/Icon.svelte';
  import { IconType } from '../Icon/Models/IconType';

  export let title: string = '';
  export let isCollapsed: boolean = false;

  function toggleCollapse(): void {
    isCollapsed = !isCollapsed;
  }
</script>

<div class="v-stack">
  <button class="h-stack items-center justify-between appearance-none border-none" on:click={toggleCollapse}>
    <h3 class="text-lg md:text-3xl font-semibold">{title}</h3>

    <div class="w-8 h-8">
      {#if isCollapsed}
        <Icon type={IconType.chevronRight} />
      {:else}
        <Icon type={IconType.chevronDown} />
      {/if}
    </div>
  </button>

  <div class="pt-2">
    {#if isCollapsed}
      <div class="pb-2">
        <Divider />
      </div>
    {:else}
      <div class="pt-2">
        <slot />
      </div>
    {/if}
  </div>
</div>

<style>
  button:active {
    background-color: transparent;
    opacity: 0.5;
  }
</style>
