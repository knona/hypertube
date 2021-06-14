import { randomBytes } from 'crypto';

function generateRandomBytes(byteLength: number, type: BufferEncoding, length: number): string {
  return randomBytes(byteLength).toString(type).slice(0, length);
}

export function uniqueString(length: number = 32): string {
  return generateRandomBytes(Math.ceil(length * 0.5), 'hex', length);
}
