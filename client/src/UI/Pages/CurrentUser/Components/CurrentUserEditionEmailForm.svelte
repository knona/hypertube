<script lang="ts">
  import { _ } from 'svelte-i18n';

  import type { ServerError } from '../../../../Models/Server/Errors/ServerError';
  import { componentState } from '../../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../../Modules/Store/ComponentState/Models/State';
  import { currentUserStore } from '../../../../Modules/Store/CurrentUser/CurrentUserStore';
  import UserEdition from '../../../../Modules/UserEdition/UserEdition';
  import Validator from '../../../../Modules/Validator/Validator';
  import Box from '../../../Components/Box/Box.svelte';
  import InfoMessage from '../../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';
  import TextFieldValidator from '../../../Components/TextFieldValidator/TextFieldValidator.svelte';

  let state: State<ServerError> = componentState();
  let email: string = $currentUserStore.user?.email as string;
  let isEmailValid: boolean = true;

  function updateEmail(): void {
    state.setLoading();
    UserEdition.sendEmailUpdateEmail(email)
      .then(() => state.setCustom('success'))
      .catch(state.setError);
  }
</script>

<Box title={$_('page.currentUser.components.editionEmailForm.box.title')}>
  <form class="w-ful flex-1 v-stack space-y-4 justify-between" on:submit|preventDefault={updateEmail}>
    <div class="v-stack">
      <TextFieldValidator
        placeholder={$_('page.currentUser.components.editionEmailForm.emailTextField.placeholder')}
        validator={Validator.email}
        bind:isValid={isEmailValid}
        bind:text={email}
      />
    </div>

    {#if $state.current === ComponentStateType.error}
      <InfoMessage type={InfoMessageType.error}>
        <LocalizedServerError serverError={$state.error} />
      </InfoMessage>
    {:else if $state.current === 'success'}
      <InfoMessage type={InfoMessageType.success}>
        {$_('page.currentUser.components.editionEmailForm.state.success.infoMessage')}
      </InfoMessage>
    {/if}

    <div class="h-stack justify-center">
      {#if $state.current === ComponentStateType.loading}
        <LoadingIndicator />
      {:else}
        <RoundedButton
          title={$_('page.currentUser.components.editionEmailForm.updateButton.title')}
          disabled={!isEmailValid}
          on:click={updateEmail}
        />
      {/if}
    </div>
  </form>
</Box>
