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
  let firstName: string = $currentUserStore.user?.firstName as string;
  let lastName: string = $currentUserStore.user?.lastName as string;
  let isFirstNameValid: boolean = true;
  let isLastNameValid: boolean = true;
  let canUpdate: boolean = true;

  function updateInformations(): void {
    state.setLoading();
    UserEdition.updateUser(firstName, lastName)
      .then(() => state.setCustom('success'))
      .catch(state.setError);
  }

  $: canUpdate = isFirstNameValid && isLastNameValid;
</script>

<Box title={$_('page.currentUser.components.editionPersonalInformations.box.title')}>
  <form class="w-full flex-1 v-stack space-y-4 justify-between" on:submit|preventDefault={updateInformations}>
    <div class="v-stack space-y-2">
      <TextFieldValidator
        placeholder={$_('page.currentUser.components.editionPersonalInformations.firstNameTextField.placeholder')}
        validator={Validator.name}
        bind:isValid={isFirstNameValid}
        bind:text={firstName}
      />
      <TextFieldValidator
        placeholder={$_('page.currentUser.components.editionPersonalInformations.lastNameTextField.placeholder')}
        validator={Validator.name}
        bind:isValid={isLastNameValid}
        bind:text={lastName}
      />
    </div>

    {#if $state.current === ComponentStateType.error}
      <InfoMessage type={InfoMessageType.error}>
        <LocalizedServerError serverError={$state.error} />
      </InfoMessage>
    {:else if $state.current === 'success'}
      <InfoMessage type={InfoMessageType.success}>
        {$_('page.currentUser.components.editionPersonalInformations.state.success.infoMessage')}
      </InfoMessage>
    {/if}

    <div class="h-stack justify-center">
      {#if $state.current === ComponentStateType.loading}
        <LoadingIndicator />
      {:else}
        <RoundedButton
          title={$_('page.currentUser.components.editionPersonalInformations.updateButton.title')}
          disabled={!canUpdate}
          on:click={updateInformations}
        />
      {/if}
    </div>
  </form>
</Box>
