import { extname } from 'path';

export function getFileExtension(file: string): string {
  return extname(file).substring(1).toLowerCase();
}
