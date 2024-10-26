import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { BASE_URL_FRONT, EMAIL_PASS, EMAIL_USER } from '../config/env';

export async function sendResetPasswordEmail(
  to: string,
  resetUrl: string,
): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const templatePath = path.join(__dirname, '/templates/reset-password.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    const currentYear = new Date().getFullYear();
    htmlTemplate = htmlTemplate
      .replace('{{resetUrl}}', resetUrl)
      .replace('{{year}}', currentYear.toString())
      .replace('{{logo}}', `${BASE_URL_FRONT}/wise-logo.svg`);

    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject: 'Recuperação de Senha - Project Wise',
      html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log(`E-mail de recuperação enviado para ${to}`);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Erro ao enviar e-mail de recuperação de senha.');
  }
}
