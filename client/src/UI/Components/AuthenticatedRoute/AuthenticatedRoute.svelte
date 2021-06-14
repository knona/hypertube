<script lang="ts">
  import { Route } from 'svelte-routing';
  import type { Optional } from '../../../Shared/Types';
  import AuthenticatedRouteItem from './Components/AuthenticatedRouteItem.svelte';

  export let path: string;
  export let redirectUrl: Optional<string> = undefined;
</script>

<Route {path} let:params>
  <AuthenticatedRouteItem {redirectUrl}>
    <slot {params} />
  </AuthenticatedRouteItem>
</Route>
