/* eslint-disable @typescript-eslint/no-unused-vars */

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.json' {
  const content: any;
  export default content;
}

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onclickOutside?: () => void;
  }
}
