<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import type { Optional } from '../../../Shared/Types';

  export let threshold: number = 0;
  export let scrollElement: Optional<HTMLElement> = undefined;
  export let stopLoad: boolean = false;
  export let useWindow: boolean = false;
  export let isLoading: boolean = false;
  export let componentMounted: boolean = false;

  const dispatch = createEventDispatcher();

  let component: HTMLDivElement;
  let element: HTMLElement;

  $: if (componentMounted) {
    isLoading;
    loadMoreNoScroll();
  }

  function loadMore(): void {
    isLoading = true;
    dispatch('loadMore');
  }

  function loadMoreAfterScroll(): void {
    if (!stopLoad && !isLoading) {
      const offset: number = computeOffset();
      if (offset <= threshold) {
        loadMore();
      }
    }
  }

  function computeOffset(): number {
    return element.scrollHeight - element.clientHeight - element.scrollTop;
  }

  function loadMoreNoScroll() {
    if (!stopLoad) {
      const hasVerticalScroll: boolean = element.scrollHeight > element.clientHeight;
      if (!hasVerticalScroll && !isLoading) {
        loadMore();
      }
    }
  }

  function setElement(): void {
    if (useWindow) {
      element = document.documentElement;
    } else if (scrollElement) {
      element = scrollElement;
    } else {
      element = component.parentElement as HTMLElement;
    }
  }

  onMount(() => {
    setElement();
    const listenable: Document | HTMLElement = useWindow ? document : element;
    listenable.addEventListener('scroll', loadMoreAfterScroll);
    listenable.addEventListener('resize', loadMoreAfterScroll);
    componentMounted = true;
  });

  onDestroy(() => {
    const listenable: Document | HTMLElement = useWindow ? document : element;
    listenable.removeEventListener('scroll', loadMoreAfterScroll);
    listenable.removeEventListener('resize', loadMoreAfterScroll);
  });
</script>

{#if !useWindow && !scrollElement}
  <div bind:this={component} id="svelte-infinite-scroll" class="hidden" />
{/if}
