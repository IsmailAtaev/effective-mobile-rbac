import { getEnv } from '@src/infra/env/service';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: getEnv('EMAIL_HOST'),
  port: getEnv('EMAIL_PORT'),
  secure: true,
  auth: {
    user: getEnv('EMAIL_ADDRESS'),
    pass: getEnv('EMAIL_PASSWORD'),
  },
});

export const mailUtil = {
  send: async (to: string, subject: string, html: string) => {
    try {
      await transporter.sendMail({
        from: `"Auth Service" <${getEnv('EMAIL_ADDRESS')}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Mail sending failed:', error);
    }
  },

  sendCode: async (to: string, code: string) => {
    await mailUtil.send(
      to,
      'Код восстановления пароля',
      `<h1>Восстановление доступа</h1><p>Ваш проверочный код: <b>${code}</b></p>`
    );
  }
};
