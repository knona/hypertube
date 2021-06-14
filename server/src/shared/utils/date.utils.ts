import ms from 'ms';

export function computeExpirationDate(time: string): Date {
  const msTime: number = new Date().getTime() + ms(time);
  return new Date(msTime);
}
