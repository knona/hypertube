<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Icon from '../Icon/Icon.svelte';
  import { IconType } from '../Icon/Models/IconType';

  export let search: string = '';

  function clearSearch(event: MouseEvent): void {
    if (event.button === 0) {
      search = '';
    }
  }
</script>

<div class="px-3 md:max-w-md w-full">
  <div
    class="w-full px-3.5 py-1.5 h-stack items-center justify-items-stretch space-x-1.5 text-white bg-transparent border-ctrl-bg border-2 rounded-full backdrop-filter backdrop-blur-md focus-within:bg-white focus-within:text-black transition-colors"
  >
    <div class="w-4 h-4 flex-grow-0">
      <Icon type={IconType.search} />
    </div>
    <input
      class="w-full flex-1 appearance-none placeholder-white bg-transparent border-0 focus:outline-none focus:placeholder-gray-400"
      type="text"
      placeholder={$_('component.searchField.placeholder')}
      bind:value={search}
    />
    {#if search}
      <button
        class="w-3 h-3 flex-grow-0 appearance-none text-gray-500 bg-transparent border-none"
        on:click={clearSearch}
      >
        <Icon type={IconType.close} />
      </button>
    {/if}
  </div>
</div>

<style>
  button:active {
    opacity: 0.5;
    background-color: transparent;
  }
</style>
