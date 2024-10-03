const { type } = require("express/lib/response");
const { fetchUser, updateUser, createUser } = require("./service/user.service");
const { sendEmail } = require("./mail.service");

const chatId = "@eodsender";
const handleMessage = async (name, from, mssg, bot) => {
  try {
    function getCommandType(message) {
      if (message.includes("/start") || message.includes("start")) {
        return "START";
      } else if (
        message.includes("/register") ||
        message.includes("register")
      ) {
        return "REGISTER";
      } else if (message.includes("email")) {
        return "EMAIL";
      } else if (message.includes("name")) {
        return "NAME";
      } else if (message.includes("pass")) {
        return "PASS";
      } else if (message.includes("send")) {
        return "SEND";
      }
      return "DEFAULT";
    }
    // Get the command type
    const type = getCommandType(mssg.trim().toLowerCase());
    console.log(type);
    mssg = mssg.toLowerCase();
    console.log(mssg);
    switch (type) {
      case "START": {
        bot.telegram.sendMessage(
          chatId,
          `Hello ${from},\n welcome to EOD Report Sender`
        );
        break;
      }
      case "NAME": {
        let [msg, name] = mssg.split("name");
        const response = await updateUser(from, { userName: name.trim() });
        if (response)
          bot.telegram.sendMessage(chatId, "Name updated successfully");
        break;
      }
      case "REGISTER": {
        const user = await fetchUser(from);
        if (user) return bot.telegram.sendMessage(chatId, "user already exist");
        await createUser({ name, userName: from, email: "", pass: "" });
        bot.telegram.sendMessage(
          chatId,
          "please provide email and pass for nodemailer"
        );
        break;
      }
      case "EMAIL": {
        let [msg, email] = mssg.split("email");
        const response = await updateUser(from, {
          "nodemailer.email": email.trim(),
        });
        if (response)
          bot.telegram.sendMessage(
            chatId,
            "please provide pass for nodemailer"
          );
        else bot.telegram.sendMessage(chatId, "User not found");
        break;
      }
      case "PASS": {
        let [msg, pass] = mssg.split("pass");
        const response = await updateUser(from, {
          "nodemailer.pass": pass.trim(),
        });
        if (response)
          bot.telegram.sendMessage(chatId, "User registered successfully");
        else bot.telegram.sendMessage(chatId, "User not found");
        break;
      }
      case "SEND": {
        let [send, mailContent] = mssg.split("send");
        console.log(send, mailContent, "============SEND==============");
        const user = await fetchUser(from);
        if (
          !user ||
          !user.nodemailer.email ||
          !user.nodemailer.pass ||
          !user.name
        ) {
          bot.telegram.sendMessage(chatId, `User not found \n ${user}`);
          break;
        }
        let sendMessage;
        sendMessage = await sendEmail(user, mailContent);
        if (sendMessage)
          bot.telegram.sendMessage(chatId, "Mail sent successfully");
        else bot.telegram.sendMessage(chatId, `Mail not sent for ${user.name}`);
        break;
      }
      default: {
        bot.telegram.sendMessage(chatId, "Invalid command.");
        break;
      }
    }
  } catch (error) {
    console.log(
      error.message,
      "\n",
      mssg,
      "\n",
      `mssg.split("send") =>`,
      mssg.split("send"),
      "\n",
      "mssg.trim().toLowerCase() =>",
      mssg.trim().toLowerCase()
    );
  }
};

module.exports = { handleMessage, chatId };
