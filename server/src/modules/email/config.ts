import { Options } from 'nodemailer/lib/smtp-transport';
export const frontBaseUrl: string = 'http://localhost:5000';
export const frontUrlReset: string = frontBaseUrl + '/auth/reset';
export const frontUrlVerification: string = frontBaseUrl + '/auth/verify';
export const frontUrlUpdateEmail: string = frontBaseUrl + '/auth/updateEmail';
export const sender: string = 'no-reply@hypertube.com';
export const from: string = 'Hypertube <' + sender + '>';
export const gandiConfig: Options = {
  host: 'mail.gandi.net',
  port: 465,
  secure: true,
  auth: {
    user: 'no-reply@cleancode.pw',
    pass: 'qC%G=<Q%jxs)qX6w'
  }
};
