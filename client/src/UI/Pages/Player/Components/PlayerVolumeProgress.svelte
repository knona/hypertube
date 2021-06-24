<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  export let volume: number = 0;
  export let disabled: boolean = false;

  let progressElement: HTMLDivElement;
  let isLeftClickPressed: boolean = false;

  function changeVolume(event: MouseEvent): void {
    const rect: DOMRect = progressElement.getBoundingClientRect();
    const progressOffsetX: number = rect.left;
    const progressWidth: number = progressElement.offsetWidth;
    let mouseOffsetX: number = event.clientX - progressOffsetX;
    if (mouseOffsetX < 0) {
      mouseOffsetX = 0;
    }
    if (mouseOffsetX > progressWidth) {
      mouseOffsetX = progressWidth;
    }
    volume = mouseOffsetX / progressWidth;
  }

  function handleMouseMove(event: MouseEvent): void {
    if (isLeftClickPressed) {
      changeVolume(event);
    }
  }

  function handleMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    if (event.button === 0) {
      changeVolume(event);
      isLeftClickPressed = true;
    }
  }

  function leftCLickUp(event: MouseEvent): void {
    if (event.button === 0) {
      isLeftClickPressed = false;
    }
  }

  function addEventsListener(): void {
    document.addEventListener('mouseup', leftCLickUp);
    document.addEventListener('mousemove', handleMouseMove);
  }

  function removeEventsListener(): void {
    document.removeEventListener('mouseup', leftCLickUp);
    document.removeEventListener('mousemove', handleMouseMove);
  }

  onMount(() => {
    addEventsListener();
  });

  onDestroy(() => {
    removeEventsListener();
  });
</script>

<div class="w-full flex justify-center items-center h-10" bind:this={progressElement} on:mousedown={handleMouseDown}>
  <div class="bg-gray-400 m-auto rounded-full cursor-pointer bg-opacity-40" style="width: 80px; height: 6px">
    <div
      class:bg-white={!disabled}
      class:bg-gray-400={disabled}
      class="h-full rounded-full bg-opacity-100"
      style="width: {volume * 100}%"
    />
  </div>
</div>
