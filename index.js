const express = require('express');
const moment = require('moment');
const TelegramBot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');

// Initialize the Express app
const app = express();
require('dotenv').config();

// Replace with your bot token

// Create a Telegram bot instance
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
bot.stopPolling()
  .then(() => console.log('Bot polling stopped'))
  .catch(err => console.error('Error stopping bot polling:', err));
const SENDER = {
  satyam0101: {
    auth: {
      user: 'satyam@zeltatech.com', // Your email
      pass: 'efea wyre ejlr zhij', // Your email password
    },
    name: 'Satyam Sen',
  },
};

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle the /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Welcome! To send an email, use the command: /send <message>'
  );
});

// Handle the /send command
bot.onText(/\/send (.+)/, (msg, match) => {
  console.log('mesg', msg.from.username);
  const chatId = msg.chat.id;
  const emailParams = match[1].split(' ');

  if (!emailParams.length) {
    bot.sendMessage(chatId, 'Usage: /send <message>');
    return;
  }

  // if (!SENDER?.[msg.from.username]) {
  //   bot.sendMessage(chatId, 'You are not a subscribed user');
  //   return;
  // }

  // Email configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: SENDER?.[msg.from.username]?.auth,
  });
  const recipientEmail = emailParams[0];
  const subject = `EOD Report | ${
    SENDER?.[msg.from?.username]?.name
  } | Tech | ${moment().format('DD MMM YY - dddd')}`;
  const message = emailParams.join(' ');
  //   console.log('Email sent: ', msg);
  // Send the email
  const mailOptions = {
    from: 'satyam@zeltatech.com',
    // to:"naveen@zeltatech.com",
    // cc: "HR@zeltatech.com",
    to: 'bhaweshgoyal@zeltatech.com',
    cc: 'satyamsen01012000@gmail.com',
    subject: subject,
    // text: message
    html: `
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>S. No</th>
            <th>Date</th>
            <th>Task Description</th>
            <th>Task Type</th>
            <th>Department</th>
            <th>Reference (if required)</th>
            <th>Ideation</th>
            <th>Platform</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>${moment().format('DD/MM/YYYY')}</td>
            <td>${message}</td>
            <td>Tech</td>
            <td></td>
            <td></td>
            <td>VS Code</td>
            <td></td>
            <td></td>
          </tr>
          <!-- Add more rows as needed -->
        </tbody>
      </table>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      bot.sendMessage(chatId, `Failed to send email: ${error.toString()}`);
    } else {
      console.log('Email sent: ' + info.response);
      bot.sendMessage(
        chatId,
        `Email sent to ${recipientEmail} with subject "${subject}"`
      );
    }
  });
});

// Handle other messages
bot.on('message', (msg) => {
  if (!msg.text.startsWith('/')) {
    bot.sendMessage(
      msg.chat.id,
      "I don't understand that command. Use /send to send an email."
    );
  }
});
