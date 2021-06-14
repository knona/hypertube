<script lang="ts">
  export let columns: number = 1;
  export let spcaing: number = 1;
  export let custom: string = '';
</script>

<div class={`grid grid-flow-row grid-cols-${columns} gap-${spcaing} ${custom}`}>
  <slot />
</div>
