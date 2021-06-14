export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;
export type Dispatch<T = string, V = any> = (type: T, detail?: V) => void;

export type Validator = (stringValue: string) => void;
