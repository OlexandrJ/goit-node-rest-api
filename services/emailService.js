import "dotenv/config";
import sgMail from "@sendgrid/mail";


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendVerificationEmail = async (userEmail, verificationToken) => {
const msg = {
  to: 'jarovojj@meta.ua',
  from: 'jarovojj@meta.ua',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email for email verification:', error);
    throw new Error('Error sending email for email verification');
  }
};