<script lang="ts">
  import type { Comment } from '../../../Models/Comment';
  import type { ServerError } from '../../../Models/Server/Errors/ServerError';
  import { componentState } from '../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../Modules/Store/ComponentState/Models/State';
  import { preferences } from '../../../Modules/Store/Preference/PreferenceStore';
  import { userStore } from '../../../Modules/Store/User/UserStore';
  import type { UserStore } from '../../../Modules/Store/User/UserStore.interface';
  import UserManager from '../../../Modules/User/UserManager';
  import Footer from '../../Components/Footer/Footer.svelte';
  import InfoMessage from '../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import UserComments from './Components/UserComments.svelte';
  import UserFavorites from './Components/UserFavorites.svelte';
  import UserHeader from './Components/UserHeader.svelte';

  export let userId: string;

  let state: State<ServerError> = componentState({ current: ComponentStateType.loading });
  let userState: UserStore = userStore();

  function getUser(): void {
    state.setLoading();
    UserManager.getUserWithId(userId, $preferences.language)
      .then(fetchedUser => {
        userState.setUser(fetchedUser);
        state.setDefault();
      })
      .catch(state.setError);
  }

  function deleteComment(event: CustomEvent<Comment>): void {
    if ($userState.user) {
      const deletedComment: Comment = event.detail;
      userState.deleteComment(deletedComment);
    }
  }

  $: {
    userId;
    getUser();
  }
</script>

{#if $state.current === ComponentStateType.loading}
  <div class="w-screen h-screen v-stack items-center justify-center">
    <LoadingIndicator />
  </div>
{:else if $state.current === ComponentStateType.error}
  <div class="w-screen h-screen v-stack items-center justify-center">
    <InfoMessage type={InfoMessageType.error}>
      <LocalizedServerError serverError={$state.error} />
    </InfoMessage>
  </div>
{:else if $userState.user}
  <UserHeader user={$userState.user} />

  <div class="pt-8 page-padding space-y-8">
    <div class="max-width">
      <UserFavorites store={userState} />
    </div>

    <div class="max-width">
      <UserComments comments={$userState.user.comments} on:deleteComment={deleteComment} />
    </div>
  </div>
  <Footer />
{/if}
