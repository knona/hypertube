<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { ServerError } from '../../../Models/Server/Errors/ServerError';
  import Navigation from '../../../Modules/Navigation/Navigation';
  import { componentState } from '../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../Modules/Store/ComponentState/Models/State';
  import { currentUserStore } from '../../../Modules/Store/CurrentUser/CurrentUserStore';
  import { preferences } from '../../../Modules/Store/Preference/PreferenceStore';
  import UserManager from '../../../Modules/User/UserManager';
  import Collapse from '../../Components/Collapse/Collapse.svelte';
  import Footer from '../../Components/Footer/Footer.svelte';
  import Grid from '../../Components/Grid/Grid.svelte';
  import InfoMessage from '../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../Components/RoundedButton/RoundedButton.svelte';
  import CurrentUserEditionEmailForm from './Components/CurrentUserEditionEmailForm.svelte';
  import CurrentUserEditionPersonalInformationsForm from './Components/CurrentUserEditionPersonalInformationsForm.svelte';
  import CurrentUserEditionProfilePicture from './Components/CurrentUserEditionProfilePicture.svelte';
  import CurrentUserEditionSecurityForm from './Components/CurrentUserEditionSecurityForm.svelte';
  import CurrentUserEditionUsernameForm from './Components/CurrentUserEditionUsernameForm.svelte';
  import CurrentUserFavorites from './Components/CurrentUserFavorites.svelte';
  import CurrentUserWatched from './Components/CurrentUserWatched.svelte';

  let state: State<ServerError> = componentState({ current: ComponentStateType.loading });

  function getCurrentUser(): void {
    state.setLoading();
    UserManager.getCurrentUser($preferences.language)
      .then(() => state.setDefault())
      .catch(state.setError);
  }

  function goToAuthentication(): void {
    currentUserStore.clear();
    Navigation.navigateTo('/welcome');
  }

  onMount(() => {
    getCurrentUser();
  });
</script>

{#if $state.current === ComponentStateType.loading}
  <div class="w-screen h-screen v-stack items-center justify-center">
    <LoadingIndicator />
  </div>
{:else if $state.current === ComponentStateType.error}
  <div class="w-screen h-screen v-stack items-center justify-center space-y-2">
    <InfoMessage type={InfoMessageType.error}>
      <LocalizedServerError serverError={$state.error} />
    </InfoMessage>
    <RoundedButton title={$_('page.currentUser.state.error.authenticateButton.title')} on:click={goToAuthentication} />
  </div>
{:else}
  <div class="space-y-8">
    <CurrentUserEditionProfilePicture />

    <div class="page-padding space-y-8">
      <div class="max-width">
        <Collapse title="Infos">
          <Grid columns={1} spcaing={4} custom="md:grid-cols-2">
            <CurrentUserEditionPersonalInformationsForm />
            <CurrentUserEditionUsernameForm />
            <CurrentUserEditionEmailForm />
            <CurrentUserEditionSecurityForm />
          </Grid>
        </Collapse>
      </div>

      <div class="max-width">
        <CurrentUserFavorites />
      </div>

      <div class="max-width">
        <CurrentUserWatched />
      </div>
    </div>

    <Footer />
  </div>
{/if}
