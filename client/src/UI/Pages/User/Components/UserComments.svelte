<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { Comment } from '../../../../Models/Comment';
  import type { Dispatch } from '../../../../Shared/Types';
  import Collapse from '../../../Components/Collapse/Collapse.svelte';
  import CommentBubble from '../../../Components/CommentBubble/CommentBubble.svelte';
  import EmptyView from '../../../Components/EmptyView/EmptyView.svelte';

  export let comments: Comment[];

  const dispatch: Dispatch<string> = createEventDispatcher<string>();

  function deleteComment(event: CustomEvent<Comment>): void {
    dispatch('deleteComment', event.detail);
  }
</script>

<Collapse title={$_('page.user.components.comments.collaspse.title')}>
  {#if comments.length === 0}
    <EmptyView description={$_('page.user.components.comments.emptyView.description')} />
  {:else}
    {#each comments as comment}
      <CommentBubble {comment} on:delete={deleteComment} />
    {/each}
  {/if}
</Collapse>
