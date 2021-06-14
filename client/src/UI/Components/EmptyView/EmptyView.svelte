<script lang="ts">
  export let description: string;
</script>

<div class="h-40 v-stack center-content">
  <div class="v-stack items-center space-y-4">
    <h2 class="text-2xl font-bold opacity-70">{description}</h2>
    <slot />
  </div>
</div>
