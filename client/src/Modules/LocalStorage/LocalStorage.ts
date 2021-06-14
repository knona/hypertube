import type { Optional } from '../../Shared/Types';

export class LocalStorage<T> {
  public constructor(public key: string) {}

  public get(): Optional<T> {
    const stringValue: Optional<string> | null = localStorage.getItem(this.key);
    if (this.isUndefined(stringValue)) {
      return undefined;
    }
    return JSON.parse(stringValue as string) as Optional<T>;
  }

  public set(value: Optional<T>) {
    if (!value) {
      localStorage.removeItem(this.key);
      return;
    }
    const stringValue: string = JSON.stringify(value);
    localStorage.setItem(this.key, stringValue);
  }

  private isUndefined(stringValue: Optional<string> | null): boolean {
    return stringValue === 'undefined' || stringValue === undefined || stringValue === null;
  }
}
