import { Subject } from 'rxjs';

const shouldLogout: Subject<void> = new Subject();
const shouldClearSearch: Subject<void> = new Subject();

export default {
  shouldLogout,
  shouldClearSearch
};
