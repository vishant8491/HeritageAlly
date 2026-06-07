require('dotenv').config();
const mailer = require('./middleware/mailer');

console.log('Running SMTP test - this will attempt to verify connection and send a test email.')

mailer.verify((err, success) => {
  if (err) {
    console.error('\nSMTP verify error:');
    console.error(err);
    process.exit(1);
  }
  console.log('\nSMTP verified — ready to send test message.');
  mailer.sendMail({
    from: process.env.MAILSENDER,
    to: process.env.MAILTEST_RECIPIENT || process.env.MAILSENDER,
    subject: 'HeritageAlly SMTP test',
    text: 'This is a test message from HeritageAlly SMTP test script.'
  }, (err, info) => {
    if (err) {
      console.error('\nsendMail error:');
      console.error(err);
      process.exit(1);
    }
    console.log('\nsendMail ok:', info);
    process.exit(0);
  });
});