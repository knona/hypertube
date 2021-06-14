export interface MenuItem<T> {
  value: T;
  render: () => string;
}
