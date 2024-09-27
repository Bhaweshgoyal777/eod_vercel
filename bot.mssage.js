const { type } = require("express/lib/response");
const { fetchUser, updateUser, createUser } = require("./service/user.service");
const { sendEmail } = require("./mail.service");

const chatId = "@eodsender";
const handleMessage = async (from, mssg, bot) => {
  try {
    /*
                    {
            message_id: 46,
            from: {
                id: 1003455705,
                is_bot: false,
                first_name: 'Bháwëśh',
                last_name: 'Ğøýàĺ',
                username: 'Bhaweshgoyal',
                language_code: 'en'
            },
            author_signature: 'Bháwëśh Ğøýàĺ',
            chat: {
                id: -1002388496470,
                title: 'EOD REPORT SENDER',
                username: 'eodsender',
                type: 'channel'
            },
            date: 1727420428,
            text: '/ttsar',
            entities: [ { offset: 0, length: 6, type: 'bot_command' } ]
            }
    */
    // const checkUser = await fetchUser(from);
    // if (!checkUser) {
    //   bot.sendMessage(
    //     chatId,
    //     `Hello ${from},\n please provide my nodemailer email and pass`
    //   );
    // }
    function getCommandType(message) {
      if (message.includes("/start")) {
        return "START";
      } else if (message.includes("/register")) {
        return "REGISTER";
      } else if (message.includes("email")) {
        return "EMAIL";
      } else if (message.includes("pass")) {
        return "PASS";
      } else if (message.includes("send")) {
        return "SEND";
      }
      return "DEFAULT";
    }

    // Get the command type
    const type = getCommandType(mssg.toLowerCase());
    console.log(type);
    switch (type) {
      case "START": {
        bot.sendMessage(
          chatId,
          `Hello ${from},\n welcome to EOD Report Sender`
        );
        break;
      }
      case "REGISTER": {
        await createUser({ userName: from, email: "", pass: "" });
        bot.sendMessage(chatId, "please provide email and pass for nodemailer");
        break;
      }
      case "EMAIL": {
        let [msg, email] = mssg.split("email");
        const response = await updateUser(from, {
          "nodemailer.email": email.trim(),
        });
        if (response)
          bot.sendMessage(chatId, "please provide pass for nodemailer");
        else bot.sendMessage(chatId, "User not found");
        break;
      }
      case "PASS": {
        let [msg, pass] = mssg.split("pass");
        const response = await updateUser(from, {
          "nodemailer.pass": pass.trim(),
        });
        if (response) bot.sendMessage(chatId, "User registered successfully");
        else bot.sendMessage(chatId, "User not found");
        break;
      }
      case "SEND": {
        let [send, mailContent] = mssg.split("send");
        const user = await fetchUser(from);
        const sendMessage = await sendEmail(user, mailContent);
        if (sendMessage) bot.sendMessage(chatId, "Mail sent successfully");
        else bot.sendMessage(chatId, "Mail not sent");
        break;
      }
      default: {
        bot.sendMessage(chatId, "Invalid command");
        break;
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { handleMessage };
