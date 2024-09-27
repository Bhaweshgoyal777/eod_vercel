// const { Telegraf } = require('telegraf');
// import TelegramBot from "node-telegram-bot-api";

const TelegramBot = require("node-telegram-bot-api");
const { handleMessage } = require("./bot.mssage");

require("dotenv").config();
const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

function initBot() {
  bot.on("channel_post", (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text || "";
    handleMessage(msg.from.username, messageText, bot);
  });
}

module.exports = { bot, initBot };

// bot.use(session())

// Launch bot
// bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stopPolling("SIGINT"));
process.once("SIGTERM", () => bot.stopPolling("SIGTERM"));
