<script lang="ts">
  export let title: string = '';
</script>

<div class="px-6 py-4 v-stack justify-items-stretch box">
  <h2 class="pb-2 font-bold text-lg">{title}</h2>
  <slot class="flex-1" />
</div>
