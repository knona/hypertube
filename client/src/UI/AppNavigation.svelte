<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */

  import { Subject } from 'rxjs';
  import { takeUntil, tap } from 'rxjs/operators';
  import { onDestroy, onMount } from 'svelte';
  import { Route, Router } from 'svelte-routing';
  import { globalHistory } from 'svelte-routing/src/history';
  import AppEvent from '../Modules/AppEvent/AppEvent';
  import Navigation from '../Modules/Navigation/Navigation';
  import { currentUserStore } from '../Modules/Store/CurrentUser/CurrentUserStore';
  import { currentPath } from '../Modules/Store/Path/PathStore';
  import AuthenticatedRoute from './Components/AuthenticatedRoute/AuthenticatedRoute.svelte';
  import NavigationBar from './Components/NavigationBar/NavigationBar.svelte';
  import Page from './Components/Page/Page.svelte';
  import Redirect from './Components/Redirect/Redirect.svelte';
  import CurrentUserPage from './Pages/CurrentUser/CurrentUserPage.svelte';
  import ForgotPasswordPage from './Pages/ForgotPassword/ForgotPasswordPage.svelte';
  import FtAuthenticationPage from './Pages/FTAuthentication/FTAuthenticationPage.svelte';
  import HomePage from './Pages/Home/HomePage.svelte';
  import MoviePage from './Pages/Movie/MoviePage.svelte';
  import ResetPasswordPage from './Pages/ResetPassword/ResetPasswordPage.svelte';
  import SearchPage from './Pages/Search/SearchPage.svelte';
  import UpdateEmailPage from './Pages/UpdateEmail/UpdateEmailPage.svelte';
  import UserPage from './Pages/User/UserPage.svelte';
  import VerifyEmailPage from './Pages/VerifyEmail/VerifyEmailPage.svelte';
  import WelcomePage from './Pages/Welcome/WelcomePage.svelte';

  const destroy$: Subject<void> = new Subject();
  let search: string = '';
  let unsubscribeHistory: any;

  onMount(() => {
    AppEvent.shouldLogout
      .pipe(
        tap(() => {
          Navigation.navigateTo('/welcome', true);
          currentUserStore.clear();
        }),
        takeUntil(destroy$)
      )
      .subscribe();
    AppEvent.shouldClearSearch
      .pipe(
        tap(() => (search = '')),
        takeUntil(destroy$)
      )
      .subscribe();
    unsubscribeHistory = globalHistory.listen(({ location }: { location: Location }) => {
      $currentPath = location.pathname;
    });
  });

  onDestroy(() => {
    destroy$.next();
    destroy$.complete();
    unsubscribeHistory();
  });

  $: {
    search;
    document.body.style.overflow = search.length === 0 ? '' : 'hidden';
  }
</script>

{#if $currentPath !== '/'}
  <NavigationBar bind:search />
{/if}

<main>
  {#if search.length > 0}
    <SearchPage {search} />
  {/if}

  <div class={`${search.length === 0 ? '' : 'overflow-hidden'}`}>
    <Router>
      <AuthenticatedRoute path="/movie/:id" redirectUrl="/auth" let:params>
        <MoviePage movieId={params.id} />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/user/:id" redirectUrl="/auth" let:params>
        <UserPage userId={params.id} />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/profile" redirectUrl="/auth">
        <CurrentUserPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute path="/home" redirectUrl="/auth">
        <HomePage />
      </AuthenticatedRoute>
      <Route path="/auth/42"><Page><FtAuthenticationPage /></Page></Route>
      <Route path="/auth/verify"><Page><VerifyEmailPage /></Page></Route>
      <Route path="/auth/forgot"><Page><ForgotPasswordPage /></Page></Route>
      <Route path="/auth/reset"><Page><ResetPasswordPage /></Page></Route>
      <Route path="/auth/updateEmail"><Page><UpdateEmailPage /></Page></Route>
      <Route path="/"><WelcomePage /></Route>
      <Route path="*"><Redirect to="/" /></Route>
    </Router>
  </div>
</main>
