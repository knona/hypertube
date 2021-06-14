import { Injectable } from '@nestjs/common';
import { Data, renderFile as renderFileCb } from 'ejs';
import mjml2html from 'mjml';
import { createTransport, SentMessageInfo } from 'nodemailer';
import Mail, { Options } from 'nodemailer/lib/mailer';
import { join } from 'path';
import { from, frontUrlReset, gandiConfig } from './config';

function renderFile(template: string, ejsData: Data): Promise<string> {
  return new Promise((resolve, reject) => {
    renderFileCb(template, ejsData, (err, str: string) => {
      if (err) {
        return reject(err);
      }
      return resolve(str);
    });
  });
}

@Injectable()
export class EmailService {
  public verification(username: string, email: string, token: string, frontUrl: string): Promise<SentMessageInfo> {
    const url: string = `${frontUrl}?token=${encodeURI(token)}&username=${encodeURI(username)}`;
    return this.sendMail(email, 'Vérification de votre adresse email', 'layout', {
      title: 'Vérifiez votre adresse email',
      content: `Bonjour ${username} !<br />
      Veuillez vérifiez votre adresse email en cliquant sur le bouton ou en copiant le lien ci-dessous :`,
      url,
      buttonText: 'Vérifier mon adresse email'
    });
  }

  public resetPassword(username: string, email: string, token: string): Promise<SentMessageInfo> {
    const url: string = `${frontUrlReset}?token=${encodeURI(token)}&username=${encodeURI(username)}`;
    return this.sendMail(email, 'Réinitialistion de votre mot de passe', 'layout', {
      title: 'Réinitialisez votre mot de passe',
      content: `Bonjour ${username} !<br />
      Veuillez réinitialiser votre mot de passe en cliquant sur le bouton ou en copiant le lien ci-dessous :`,
      url,
      buttonText: 'Réinitialiser mon mot de passe'
    });
  }

  public resetPasswordSuccess(username: string, email: string): Promise<SentMessageInfo> {
    return this.sendMail(email, 'Mot de passe modifié', 'layout', {
      title: 'Modification de votre mot de passe',
      content: `Bonjour ${username} !<br />
      Votre mot de passe a été modifié avec succès`
    });
  }

  public verificationSuccess(username: string, email: string): Promise<SentMessageInfo> {
    return this.sendMail(email, 'Adresse email vérifiée', 'layout', {
      title: 'Votre adresse email a bien été vérifiée',
      content: `Bonjour ${username} !<br />
      Votre adresse email a bien été vérifiée. A très vite sur Hypertube !`
    });
  }

  private async sendMail(email: string, subject: string, template: string, ejsData: Data): Promise<SentMessageInfo> {
    const basePathTemplates: string = join('src', 'modules', 'email', 'templates', 'mjml');
    const mjml: string = await renderFile(join(basePathTemplates, template + '.mjml'), ejsData);
    const html: string = mjml2html(mjml).html;
    const message: Options = { from, to: email, subject, html };
    const transporter: Mail = createTransport(gandiConfig);
    return transporter.sendMail(message);
  }
}
