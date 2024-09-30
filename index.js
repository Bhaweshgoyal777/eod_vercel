// // const express = require('express');
// // const { bot, initBot } = require('./bot');

// // const app = express();

// // const PORT = process.env.PORT || 3000;

// // app.listen(PORT, async() => {
// //   await initBot()
// // //   bot.on("message", async (msg) => {
// // //     console.log(msg);
// // //     bot.sendMessage(chatId, error.response.data.message);
// // // })
// //   console.log(`Server is running on port ${PORT}`);
// // })

// // Import required modules
// const express = require('express');
// const TelegramBot = require('node-telegram-bot-api');
// require('dotenv').config();

// // Initialize express app
// const app = express();

// // Parse JSON bodies for incoming requests
// app.use(express.json());

// // Get the bot token from environment variables
// const token = process.env.TELEGRAM_TOKEN;
// if (!token) {
//   throw new Error('TELEGRAM_TOKEN must be provided!');
// }

// // Create a new Telegram bot instance with polling enabled
// const bot = new TelegramBot(token, { polling: true });

// // Route for health check (optional)
// app.get('/', (req, res) => {
//   res.send('Hello! Bot is running.');
// });

// // Handle messages from the channel
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   const messageText = msg.text || '';

//   console.log(`Received message: "${messageText}" from chat ID: ${chatId}`);

//   // Check if the message is from a channel or group
//   if (msg.chat.type === 'channel' || msg.chat.type === 'supergroup' || msg.chat.type === 'group') {
//     // Reply to the received message
//     bot.sendMessage(chatId, 'Hello! I received your message.');
//   }
// });

// // Start the express server for the health check endpoint
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// Import required modules
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { initBot } = require("./bot");
const { connectMongoose } = require("./database");
const { initCron } = require("./cron");
require("dotenv").config();
// Initialize express app
const app = express();

// Parse JSON bodies for incoming requests
app.use(express.json());

// Get the bot token from environment variables
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_TOKEN must be provided!");
}

// Create a new Telegram bot instance with polling enabled

// Define the chat ID of your public channel
const channelId = process.env.CHANNEL_ID; // Use the channel ID from .env file, or hardcode it like -1001234567890

// Route for health check (optional)
app.get("/", (req, res) => {
  res.send("Hello! Bot is running.");
});

// Start the express server for the health check endpoint
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  initCron();
  initBot();
  connectMongoose();
  console.log(`Server is running on port ${PORT}`);
});
