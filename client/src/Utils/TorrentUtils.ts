import { streamUrl } from '../Shared/Constants';

export function torrentUrl(hash: string, token: string): string {
  return `${streamUrl}?hash=${hash}&token=${token}`;
}
