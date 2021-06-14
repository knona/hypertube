<script lang="ts">
  import { onMount } from 'svelte';
  import Navigation from '../../../Modules/Navigation/Navigation';

  export let to: string = '';

  onMount(() => {
    Navigation.navigateTo(to, true);
  });
</script>
