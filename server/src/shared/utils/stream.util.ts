import { createWriteStream, ReadStream } from 'fs';

export function storeFileFromStream(readStream: ReadStream, path: string): Promise<void> {
  return new Promise((resolve, reject) =>
    readStream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve(void 0))
      .on('error', error => reject(error))
  );
}
