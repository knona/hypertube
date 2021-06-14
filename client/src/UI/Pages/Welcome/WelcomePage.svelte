<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { fade, scale } from 'svelte/transition';
  import { currentUserStore } from '../../../Modules/Store/CurrentUser/CurrentUserStore';
  import Redirect from '../../Components/Redirect/Redirect.svelte';
  import LoginModal from './Components/LoginModal.svelte';
  import SigninModal from './Components/SigninModal.svelte';
  import { AuthenticationType } from './Models/AuthenticationType';

  let authenticationType: AuthenticationType = AuthenticationType.signin;
</script>

{#if $currentUserStore.user}
  <Redirect to="/home" />
{:else}
  <div class="bg-black">
    <div class="absolute top-0 left-0 w-screen h-screen overflow-hidden">
      <img
        in:fade={{ duration: 2000, delay: 2000 }}
        class="absolute top-0 left-0 w-screen h-screen object-cover"
        src="images/RainbowGradient.png"
        alt=""
      />
      <img
        in:fade={{ duration: 2000, delay: 2000 }}
        id="rotating"
        class="absolute top-0 left-0 w-screen h-screen object-cover"
        src="images/RainbowGradient.png"
        alt=""
      />
      <div class="absolute top-0 left-0 w-screen h-screen backdrop-filter backdrop-blur-xl" />
      <div class="absolute top-0 left-0 w-screen h-screen bg-black opacity-50" />
      <div class="absolute top-0 left-0 w-screen h-screen bg-gradient-to-t from-black to-transparent" />
    </div>

    <div class="z-10 py-20 v-stack items-center justify-center space-y-8 overflow-x-hidden">
      <h2 in:fade={{ duration: 2000 }} class="text-5xl text-blue-200 font-semibold opacity-20">
        {$_('page.welcome.components.welcomeTitle')}
      </h2>

      <div class="h-32 z-20 center-content">
        <img
          in:scale={{ duration: 2000, delay: 2000, opacity: 0, start: 1.1 }}
          id="logo"
          src="images/RainbowLogo.png"
          alt=""
        />
      </div>

      <div in:fade={{ duration: 2000, delay: 4000 }} class="pt-5 z-10 v-stack items-center space-y-2">
        {#if authenticationType === AuthenticationType.login}
          <LoginModal bind:authenticationType />
        {:else if authenticationType === AuthenticationType.signin}
          <SigninModal bind:authenticationType />
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  @-webkit-keyframes rotating {
    from {
      -webkit-transform: rotate(0deg) scale(2);
      -o-transform: rotate(0deg) scale(2);
      transform: rotate(0deg) scale(2);
    }
    to {
      -webkit-transform: rotate(360deg) scale(2);
      -o-transform: rotate(360deg) scale(2);
      transform: rotate(360deg) scale(2);
    }
  }
  @keyframes rotating {
    from {
      -ms-transform: rotate(0deg) scale(2);
      -moz-transform: rotate(0deg) scale(2);
      -webkit-transform: rotate(0deg) scale(2);
      -o-transform: rotate(0deg) scale(2);
      transform: rotate(0deg) scale(2);
    }
    to {
      -ms-transform: rotate(360deg) scale(2);
      -moz-transform: rotate(360deg) scale(2);
      -webkit-transform: rotate(360deg) scale(2);
      -o-transform: rotate(360deg) scale(2);
      transform: rotate(360deg) scale(2);
    }
  }

  #rotating {
    -webkit-animation: rotating 30s linear infinite;
    -moz-animation: rotating 30s linear infinite;
    -ms-animation: rotating 30s linear infinite;
    -o-animation: rotating 30s linear infinite;
    animation: rotating 30s linear infinite;
  }

  #logo {
    min-width: 600px;
    max-width: 1000px;
  }
</style>
