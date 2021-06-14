<script lang="ts">
  import { _ } from 'svelte-i18n';
  import type { ServerError } from '../../../../Models/Server/Errors/ServerError';
  import Authentication from '../../../../Modules/Authentication/Authentication';
  import Navigation from '../../../../Modules/Navigation/Navigation';
  import { componentState } from '../../../../Modules/Store/ComponentState/ComponentStateStore';
  import { ComponentStateType } from '../../../../Modules/Store/ComponentState/Models/ComponentStateType';
  import type { State } from '../../../../Modules/Store/ComponentState/Models/State';
  import Validator from '../../../../Modules/Validator/Validator';
  import InfoMessage from '../../../Components/InfoMessage/InfoMessage.svelte';
  import { InfoMessageType } from '../../../Components/InfoMessage/Models/InfoMessageType';
  import LoadingIndicator from '../../../Components/LoadingIndicator/LoadingIndicator.svelte';
  import RoundedButton from '../../../Components/RoundedButton/RoundedButton.svelte';
  import { TextFieldType } from '../../../Components/TextField/Models/TextFieldType';
  import TextFieldValidator from '../../../Components/TextFieldValidator/TextFieldValidator.svelte';
  import LocalizedServerError from './../../../Components/LocalizedServerError/LocalizedServerError.svelte';

  let authenticationState: State<ServerError> = componentState();
  let firstName: string = '';
  let lastName: string = '';
  let username: string = '';
  let email: string = '';
  let password: string = '';
  let isFirstNameValid: boolean = false;
  let isLastNameValid: boolean = false;
  let isUsernameValid: boolean = false;
  let isEmailValid: boolean = false;
  let isPasswordValid: boolean = false;
  let canAuthenticate: boolean = false;

  function signinWithEmail(): void {
    authenticationState.setLoading();
    Authentication.signinWithEmail(firstName, lastName, username, email, password)
      .then(() => {
        authenticationState.setDefault();
        Navigation.navigateTo('/auth/verify');
        return;
      })
      .catch(authenticationState.setError);
  }

  $: canAuthenticate = isFirstNameValid && isLastNameValid && isUsernameValid && isEmailValid && isPasswordValid;
</script>

<form class="flex flex-col space-y-2" on:submit|preventDefault={signinWithEmail}>
  <TextFieldValidator
    placeholder={$_('page.welcome.components.signinEmailForm.firstNameTextField.placeholder')}
    validator={Validator.name}
    bind:text={firstName}
    bind:isValid={isFirstNameValid}
  />
  <TextFieldValidator
    placeholder={$_('page.welcome.components.signinEmailForm.lastNameTextField.placeholder')}
    validator={Validator.name}
    bind:text={lastName}
    bind:isValid={isLastNameValid}
  />
  <TextFieldValidator
    placeholder={$_('page.welcome.components.signinEmailForm.usernameTextField.placeholder')}
    validator={Validator.username}
    bind:text={username}
    bind:isValid={isUsernameValid}
  />
  <TextFieldValidator
    placeholder={$_('page.welcome.components.signinEmailForm.emailTextField.placeholder')}
    validator={Validator.email}
    bind:text={email}
    bind:isValid={isEmailValid}
  />
  <TextFieldValidator
    type={TextFieldType.password}
    placeholder={$_('page.welcome.components.signinEmailForm.passwordTextField.placeholder')}
    validator={Validator.password}
    bind:text={password}
    bind:isValid={isPasswordValid}
  />

  {#if $authenticationState.current === ComponentStateType.error}
    <div class="w-full">
      <InfoMessage type={InfoMessageType.error}>
        <LocalizedServerError serverError={$authenticationState.error} />
      </InfoMessage>
    </div>
  {/if}

  {#if $authenticationState.current === ComponentStateType.loading}
    <div class="pt-2 v-stack w-full center-content">
      <LoadingIndicator />
    </div>
  {:else}
    <RoundedButton
      title={$_('page.welcome.components.signinEmailForm.signinButton.title')}
      disabled={!canAuthenticate}
    />
  {/if}
</form>
