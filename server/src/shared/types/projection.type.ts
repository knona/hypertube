export type Projection<T> = { [key in keyof T]?: boolean } & { _id?: boolean };
