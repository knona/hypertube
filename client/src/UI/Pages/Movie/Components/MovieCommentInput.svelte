<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ServerError } from '../../../../Models/Server/Errors/ServerError';
  import CommentManager from '../../../../Modules/Comment/CommentManager';
  import { componentState } from '../../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../../Modules/Store/ComponentState/Models/State';
  import { currentUserStore } from '../../../../Modules/Store/CurrentUser/CurrentUserStore';
  import type { Dispatch } from '../../../../Shared/Types';
  import InfoMessage from '../../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';
  import UserPicture from '../../../Components/UserPicture/UserPicture.svelte';

  export let tmdbId: number;

  const dispatch: Dispatch<string> = createEventDispatcher<string>();
  let state: State<ServerError> = componentState();
  let content: string = '';

  function comment(): void {
    state.setLoading();
    CommentManager.createComment(tmdbId, content)
      .then(publishedComment => {
        content = '';
        state.setDefault();
        dispatch('comment', publishedComment);
      })
      .catch(state.setError);
  }
</script>

<div id="comment-input" class="v-stack space-y-2">
  <div class="h-stack items-end justify-items-stretch space-x-2">
    <div class="w-14 h-14">
      <UserPicture pictureUrl={$currentUserStore.user?.pictureUrl} />
    </div>
    <textarea
      id="comment-bubble"
      class="w-full px-4 py-3 flex-1 appearence-none bg-secondary-bg border-none placeholder-secondary-text rounded-xl resize-y"
      placeholder="Comment..."
      bind:value={content}
    />
  </div>

  <div class="v-stack items-end">
    <div class="h-stack items-center">
      <div class="opacity-0">
        <RoundedButton title="C" disabled={true} />
      </div>
      {#if $state.current === ComponentStateType.loading}
        <LoadingIndicator />
      {:else if $state.current === ComponentStateType.error}
        <InfoMessage type={InfoMessageType.error}>
          <LocalizedServerError serverError={$state.error} />
        </InfoMessage>
      {:else if content.length > 0}
        <RoundedButton title="Comment" on:click={comment} />
      {/if}
    </div>
  </div>
</div>

<style>
  #comment-input {
    max-width: 700px;
  }

  #comment-bubble {
    min-height: 50px;
  }
</style>
