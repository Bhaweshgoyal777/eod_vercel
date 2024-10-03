// Import required modules
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { initBot } = require("./bot");
const { connectMongoose } = require("./database");
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
const server = app.listen(PORT, () => {
  initBot();
  connectMongoose();
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close();
  console.log("Server closed");
});

process.on("SIGINT", () => {
  server.close();
  console.log("Server closed");
});
