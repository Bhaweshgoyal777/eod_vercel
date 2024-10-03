const { Context, session, Telegraf } = require("telegraf");
// import TelegramBot from "node-telegram-bot-api";

const { handleMessage } = require("./bot.mssage");

require("dotenv").config();
const token = process.env.TELEGRAM_TOKEN;

// const bot = new TelegramBot(token, { polling: true });
const bot = new Telegraf(token);

bot.use(session());
// Launch bot
bot
  .launch()
  .then(() => {
    console.info(`Telegram Bot launched successfully.`);
  })
  .catch((error) => {
    console.error(`Error launching Telegram Bot: ${error.message}`);
  });

function initBot() {
  bot.on("channel_post", (msg) => {
    const messageText = msg.text || "";
    handleMessage(msg.author_signature, msg.from.username, messageText, bot);
  });
}

module.exports = { bot, initBot };

// bot.use(session())

// Launch bot
// bot.launch()

// Enable graceful stop
process.once("SIGINT", () => bot.stopPolling("SIGINT"));
process.once("SIGTERM", () => bot.stopPolling("SIGTERM"));
