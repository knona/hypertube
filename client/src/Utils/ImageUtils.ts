import { backUrl } from '../Shared/Constants';

export function imageUrl(url: string): string {
  return `${backUrl}/${url}`;
}
