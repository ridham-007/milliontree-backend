const nodemailer = require('nodemailer');

export function sendMail(
    send_to: string,
    emailBody: string,
    subject: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env['EMAIL_HOST'],
      port: 587,
      auth: {
        user: process.env['EMAIL_USER'], // generated ethereal user
        pass: process.env['EMAIL_PASS'], // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  
    const options = {
      from: process.env['EMAIL_USER'],
      to: send_to,
      subject: subject,
      html: emailBody,
    };
  
    // send Mail
    return new Promise((resolve, reject) => {
      transporter
        .sendMail(options)
        .then(() => {
          resolve();
        })
        .catch((err: any) => {
          resolve();
        });
    });
  }