// const nodemailer = require("nodemailer")
// const mailer = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, 
//   auth: {
//     user: process.env.MAILSENDER,
//     pass: process.env.PASSWORD,
//   },
// })

// module.exports = mailer




// If email did not send(By email error ) on gmail for otp use this given below


require('dotenv').config()
const nodemailer = require("nodemailer")

if (!process.env.MAILSENDER || !process.env.PASSWORD) {
  console.error('\n[mailer] Missing MAILSENDER or PASSWORD environment variable.')
  console.error('[mailer] Set MAILSENDER and PASSWORD (App Password for Gmail if 2FA enabled).')
  console.error('[mailer] Example (Windows PowerShell):')
  console.error('  setx MAILSENDER "you@example.com"')
  console.error('  setx PASSWORD "your_app_password_here"')
  console.error('[mailer] After setting env vars restart the server.\n')
}

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILSENDER,
    pass: process.env.PASSWORD,
  },
})

module.exports = mailer