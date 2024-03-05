import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
  },
};

interface EmailData {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = (data: EmailData) => {
  const transporter = nodemailer.createTransport(config);
  transporter.sendMail(data, (error, info) => {
    if (error) {
      console.log('SendEmailError: ' + error.message);
    } else {
      return info.response;
    }
  });
};
