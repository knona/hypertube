<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  export let time: number = 0;
  export let duration: number = 120 * 60;

  let progressElement: HTMLDivElement;
  let isLeftClickPressed: boolean = false;

  function changeTime(event: MouseEvent): void {
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
    time = duration * (mouseOffsetX / progressWidth);
  }

  function handleMouseMove(event: MouseEvent): void {
    if (isLeftClickPressed) {
      changeTime(event);
    }
  }

  function handleMouseDown(event: MouseEvent): void {
    event.stopPropagation();
    if (event.button === 0) {
      changeTime(event);
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

<div
  class="w-full group flex justify-center items-center h-10"
  bind:this={progressElement}
  on:mousedown={handleMouseDown}
>
  <div
    class="bg-gray-400 m-auto rounded-full cursor-pointer bg-opacity-40 w-full h-1.5 transition-height duration-200 ease-out group-hover:h-3.5"
  >
    <div
      class="bg-white h-full rounded-full bg-opacity-80 group-hover:bg-opacity-100"
      style="min-width: 10px; width: {(time / duration) * 100}%"
    />
  </div>
</div>
