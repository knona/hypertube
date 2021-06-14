<script lang="ts">
  import dayjs from 'dayjs';
  import { createEventDispatcher } from 'svelte';
  import type { Comment } from '../../../Models/Comment';
  import type { ServerError } from '../../../Models/Server/Errors/ServerError';
  import CommentManager from '../../../Modules/Comment/CommentManager';
  import Navigation from '../../../Modules/Navigation/Navigation';
  import { componentState } from '../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../Modules/Store/ComponentState/Models/State';
  import type { Dispatch } from '../../../Shared/Types';
  import InfoMessage from '../InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../LocalizedServerError/LocalizedServerError.svelte';
  import UserPicture from '../UserPicture/UserPicture.svelte';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { currentUserStore } from '../../../Modules/Store/CurrentUser/CurrentUserStore';
  import { _ } from 'svelte-i18n';
  import localizedFormat from 'dayjs/plugin/localizedFormat';
  import 'dayjs/locale/fr';
  import { preferences } from '../../../Modules/Store/Preference/PreferenceStore';

  export let comment: Comment;

  const dispatch: Dispatch<string> = createEventDispatcher<string>();
  let state: State<ServerError> = componentState();

  function authorName(): string {
    if ($currentUserStore.user?.id === comment.author.id) {
      return 'You';
    }
    return `${comment.author.firstName} ${comment.author.lastName}`;
  }

  function formattedCommentDate(): string {
    dayjs.extend(relativeTime);
    dayjs.extend(localizedFormat);
    return dayjs(comment.createdAt).locale($preferences.language).fromNow();
  }

  function deleteComment(): void {
    state.setLoading();
    CommentManager.deleteComment(comment.id)
      .then(() => {
        state.setDefault();
        dispatch('delete', comment);
      })
      .catch(state.setError);
  }

  function goToUser(): void {
    Navigation.navigateTo(`/user/${comment.author.id}`);
  }
</script>

<div class="group v-stack comment-width">
  <div class="h-stack items-end justify-items-stretch space-x-2">
    <button class="w-14 h-14 flex-shrink-0 appearance-none bg-transparent border-none" on:click={goToUser}>
      <UserPicture pictureUrl={comment.author.pictureUrl} />
    </button>

    <div class="v-stack flex-1">
      <h5 class="pl-4 pb-1 text-xs text-secondary-text">{formattedCommentDate()}</h5>
      <div class="v-stack px-4 py-3 flex-1 bg-secondary-bg rounded-xl break-words break-all">
        <h5 class="text-xs text-secondary-text">{authorName()}</h5>
        <p>{comment.content}</p>
      </div>
    </div>
  </div>

  <div class="v-stack items-end">
    <div class="h-stack items-center">
      <div class="opacity-0">
        <button class="text-sm text-secondary-text" disabled={true} on:click={deleteComment}>Comment</button>
      </div>
      {#if $state.current === ComponentStateType.loading}
        <LoadingIndicator />
      {:else if $state.current === ComponentStateType.error}
        <InfoMessage type={InfoMessageType.error}>
          <LocalizedServerError serverError={$state.error} />
        </InfoMessage>
      {:else if $currentUserStore.user?.id === comment.author.id}
        <div class="opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <button
            class="pr-4 appearence-none border-none bg-transparent text-xs text-secondary-text"
            on:click={deleteComment}>{$_('component.commentBubble.deleteButton.title')}</button
          >
        </div>
      {/if}
    </div>
  </div>
</div>
