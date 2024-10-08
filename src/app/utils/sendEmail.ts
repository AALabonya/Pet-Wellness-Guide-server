import nodemailer from 'nodemailer';

import config from '../config';

export const sendEmail = async (resetUILink: string, email: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production',
    auth: {
      user: 'ikraamoni@gmail.com',
      pass: 'vnmk pitr cvak rjxw',
    },
  });

  // send mail
  await transporter.sendMail({
    from: 'ikraamoni@gmail.com',
    to: `${email}`,
    subject: 'Reset you password within 2 hour',
    text: '',
    html: resetUILink,
  });
};
