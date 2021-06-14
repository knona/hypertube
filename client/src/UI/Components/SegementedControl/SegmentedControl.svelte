<script lang="ts">
  import type { SegmentedControlSegment } from './Models/SegmentedControlSegment';

  export let segments: SegmentedControlSegment<any>[];
  export let selectedSegment: SegmentedControlSegment<any> = segments[0];

  function selectSegment(segment: SegmentedControlSegment<any>): void {
    selectedSegment = segment;
  }
</script>

<div class="p-1 bg-secondary-bg rounded-full">
  {#each segments as segment}
    <button
      class={`px-6 py-1 text-sm rounded-full border-none ${
        segment.value === selectedSegment.value ? 'text-black bg-white font-semibold' : 'bg-transparent'
      }`}
      on:click={() => selectSegment(segment)}
    >
      {segment.localized}
    </button>
  {/each}
</div>
