<script lang="ts">
  import NavigationBarAuthenticationButton from '../NavigationBarAuthenticationButton/NavigationBarAuthenticationButton.svelte';
  import NavigationBarLanguageMenu from '../NavigationBarLanguageMenu/NavigationBarLanguageMenu.svelte';
  import SearchField from '../SearchField/SearchField.svelte';
  import Logo from './../Logo/Logo.svelte';

  export let search: string = '';
</script>

<nav
  class="fixed z-40 w-screen py-5 md:block md:v-stack items-center page-padding bg-gradient-to-b from-black to-transparent hidden"
>
  <div class="w-full my-grid">
    <div class="h-stack w-full"><Logo /></div>
    <SearchField bind:search />
    <div class="w-full h-stack items-center justify-end">
      <div><NavigationBarLanguageMenu /></div>
      <NavigationBarAuthenticationButton />
    </div>
  </div>
</nav>

<nav
  class="fixed z-40 w-screen py-5 page-padding v-stack space-y-4 bg-gradient-to-b from-black to-transparent md:hidden"
>
  <div class="h-stack items-center justify-between">
    <div><Logo /></div>
    <div class="h-stack items-center justify-end">
      <div>
        <NavigationBarLanguageMenu />
      </div>
      <NavigationBarAuthenticationButton />
    </div>
  </div>
  <SearchField bind:search />
</nav>

<style>
  .my-grid {
    display: grid;
    justify-items: center;
    grid-template-columns: minmax(260px, 1fr) minmax(200px, 100%) minmax(260px, 1fr);
  }
</style>
