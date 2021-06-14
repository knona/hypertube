import dayjs, { Dayjs } from 'dayjs';

export class Token {
  public token: string;
  public expirationDate: string;

  public get willExpireSoon(): boolean {
    const currentDate: Dayjs = dayjs();
    const expireDate: Dayjs = dayjs(this.expirationDate);
    const hours: number = expireDate.diff(currentDate, 'hours', true);
    return hours < 1;
  }
}
