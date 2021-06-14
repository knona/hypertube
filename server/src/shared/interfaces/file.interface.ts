import { Readable } from 'stream';

export interface File {
  mimetype: string;
  stream: Readable;
  extension: string;
}
