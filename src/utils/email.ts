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

function userRegistrationEmail(userName: string) {
  const formatMessage = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
            .header {
              background-color: #3A8340;
              color: #ffffff;
              padding: 20px 20px 20px 20px;
              text-align: center;
              margin-bottom: 20px;
              border-radius: 8px;
          }

          .img1 img {
              width: 30px !important;
              border-radius: 100px;
              padding: 0px;
          }
            img.img2 {
              width: 30px !important;
              height: 30px !important;
          }
  
           .title{
              color: #ffffff;
          }
          
          .imgdiv {
            width: 100%;
            display: flex;
            justify-content: center;
            padding-bottom:20px;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
          }
          
          .a1{
            color: #424243;
            margin-left: 15px;
            
          }
          .content {
              padding: 20px;
          }
          .content p {
              margin: 0 0 15px;
          }
          .button {
              display: inline-block;
              padding: 10px 20px;
              margin: 20px 0;
              background-color: #4CAF50;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
          }
          .footer {
              background-color: #f4f4f4;
              color: #555555;
              padding: 10px;
              text-align: center;
              font-size: 12px;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
        
          <div class="content">
              <div class="header">
                  <h1 class="title">Thank You for Registering!</h1>
              </div>
              <p>Hi ${userName},</p>
              <p>Welcome to million trees, where we make attending events as easy as pie (and twice as delicious)!</p>
              <ul>
                  <li><strong>Meet & Mingle:</strong> Networking has never been this fun! Connect with fellow attendees and maybe even find your next business partner, BFF, or someone who shares your love for pineapple pizza (we don't judge).</li><br />
                  <li><strong>Effortless Registration:</strong> Registering for events is a breeze. Seriously, it’s easier than finding a cat video on the internet.</li><br />
                  <li><strong>Handy Reminders:</strong> Never miss an event again! We’ll send you friendly reminders so you can focus on picking the perfect outfit (or PJ's, we don’t judge virtual events either).</li>
              </ul>
              <p>So, dive in and explore! We’re here to make sure your event experience is top-notch. If you have any questions or just want to say hi, feel free to reach out.</p>
              <p>Happy event-hopping!</p>
              <br>
              <p>Cheers,<br/>The million trees Team</p>
              <p>P.S. Why did the event planner bring a ladder to the event? To take their networking to the next level! 😉</p>
          </div>
          <div class="imgdiv">
              <a href="${process.env['FRONTEND_URL']}/privacy-policy" class="a1">Privacy policy</a>
              <a href="${process.env['FRONTEND_URL']}/terms-conditions" class="a1">Terms of service</a>
              <a href="#" class="a1">Help center</a>
              <a href="#" class="a1">Unsubscribe</a>
          </div>
      </div>
  </body>
  </html>
  `;
  return formatMessage;
}
export async function sendUserRegistrationMail({
  send_to,
  userName,
}): Promise<void> {
  const emailSubject = `Welcome to MILLION TREES – Your Gateway to Amazing Events!`;

  const emailBody = userRegistrationEmail(userName);

  return await sendMail(send_to, emailBody, emailSubject);
}
