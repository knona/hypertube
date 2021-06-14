<script lang="ts">
  import Navigation from '../../../Modules/Navigation/Navigation';
  import Logo from '../../../Resources/Images/Logo.svg';

  function goToHome(): void {
    Navigation.navigateTo('/home');
  }
</script>

<button class="appearance-none border-none bg-transparent" on:click={goToHome}>
  <Logo />
</button>

<style>
  button:active {
    opacity: 0.5;
    background-color: transparent;
  }
</style>
