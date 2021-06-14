<script lang="ts">
  import type { Comment } from '../../../../Models/Comment';
  import type { MovieStore } from '../../../../Modules/Store/Movie/MovieStore.interface';
  import CommentBubble from '../../../Components/CommentBubble/CommentBubble.svelte';
  import Divider from '../../../Components/Divider/Divider.svelte';
  import MovieCommentInput from './MovieCommentInput.svelte';

  export let movie: MovieStore;

  function comment(event: CustomEvent<Comment>): void {
    const publishedComment: Comment = event.detail;
    movie.addComment(publishedComment);
  }

  function deleteComment(event: CustomEvent<Comment>): void {
    const deletedComment: Comment = event.detail;
    movie.removeComment(deletedComment);
  }
</script>

<div class="w-full comment-width">
  <MovieCommentInput tmdbId={$movie?.tmdbId ?? 0} on:comment={comment} />
  <div class="mb-8 mt-2">
    <Divider />
  </div>
  <div>
    {#each ($movie?.comments ?? []).sort((c1, c2) => new Date(c2.createdAt).getTime() - new Date(c1.createdAt).getTime()) as comment}
      <CommentBubble {comment} on:delete={deleteComment} />
    {/each}
  </div>
</div>
