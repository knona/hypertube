<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { ServerError } from '../../../../Models/Server/Errors/ServerError';
  import { componentState } from '../../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../../Modules/Store/ComponentState/Models/State';
  import UserEdition from '../../../../Modules/UserEdition/UserEdition';
  import Validator from '../../../../Modules/Validator/Validator';
  import Box from '../../../Components/Box/Box.svelte';
  import InfoMessage from '../../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import LocalizedServerError from '../../../Components/LocalizedServerError/LocalizedServerError.svelte';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';
  import { TextFieldType } from '../../../Components/TextField/Models/TextFieldType';
  import TextField from '../../../Components/TextField/TextField.svelte';
  import TextFieldValidator from '../../../Components/TextFieldValidator/TextFieldValidator.svelte';

  let state: State<ServerError> = componentState();
  let currentPassword: string = '';
  let newPassword: string = '';
  let isNewPasswordValid: boolean = false;

  function updatePassword(): void {
    state.setLoading();
    UserEdition.updatePassword(currentPassword, newPassword)
      .then(() => {
        resetPasswordComponent();
        state.setCustom('success');
      })
      .catch(state.setError);
  }

  function resetPasswordComponent(): void {
    currentPassword = '';
    newPassword = '';
  }
</script>

<Box title={$_('page.currentUser.components.editionSecuritForm.box.title')}>
  <form class="w-full v-stack space-y-4 justify-between" on:submit|preventDefault={updatePassword}>
    <div class="v-stack space-y-2">
      <TextField
        placeholder={$_('page.currentUser.components.editionSecuritForm.currentPasswordTextField.placeholder')}
        type={TextFieldType.password}
        bind:text={currentPassword}
      />
      <TextFieldValidator
        placeholder={$_('page.currentUser.components.editionSecuritForm.newPasswordTextField.placeholder')}
        type={TextFieldType.password}
        validator={Validator.password}
        bind:isValid={isNewPasswordValid}
        bind:text={newPassword}
      />
    </div>

    {#if $state.current === ComponentStateType.error}
      <InfoMessage type={InfoMessageType.error}>
        <LocalizedServerError serverError={$state.error} />
      </InfoMessage>
    {:else if $state.current === 'success'}
      <InfoMessage type={InfoMessageType.success}>
        {$_('page.currentUser.components.editionSecuritForm.state.success.infoMessage')}
      </InfoMessage>
    {/if}

    <div class="h-stack justify-center">
      {#if $state.current === ComponentStateType.loading}
        <LoadingIndicator />
      {:else}
        <RoundedButton
          title={$_('page.currentUser.components.editionSecuritForm.resetButton.title')}
          disabled={!isNewPasswordValid}
          on:click={updatePassword}
        />
      {/if}
    </div>
  </form>
</Box>
