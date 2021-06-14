<script lang="ts">
  import StarRating from 'svelte-star-rating';

  export let rating: number;
  export let size: number = 12;

  const config = {
    fullColor: 'rgb(249, 115, 22)',
    emptyColor: 'rgb(113, 113, 122)',
    size: size,
    showText: false
  };
</script>

<div class={`${rating === 0 ? 'opacity-10' : ''}`}>
  <StarRating rating={rating / 2} {config} style="margin-bottom: 0px;" />
</div>
