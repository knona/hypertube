import { navigate } from 'svelte-routing';
import AppEvent from '../AppEvent/AppEvent';

function navigateTo(url: string, replace: boolean = false): void {
  navigate(url, { replace: replace });
  AppEvent.shouldClearSearch.next();
}

export default {
  navigateTo
};
