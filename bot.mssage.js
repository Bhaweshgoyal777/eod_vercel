const { type } = require("express/lib/response");
const { fetchUser, updateUser, createUser } = require("./service/user.service");
const { sendEmail } = require("./mail.service");

const chatId = "@eodsender";
// const handleMessage = async (name, from, mssg, bot) => {
//   try {
//     function getCommandType(message) {
//       if (message.includes("/start") || message.includes("start")) {
//         return "START";
//       } else if (
//         message.includes("/register") ||
//         message.includes("register")
//       ) {
//         return "REGISTER";
//       } else if (message.includes("email")) {
//         return "EMAIL";
//       } else if (message.includes("name")) {
//         return "NAME";
//       } else if (message.includes("pass")) {
//         return "PASS";
//       } else if (message.includes("send")) {
//         return "SEND";
//       }
//       return "DEFAULT";
//     }
//     // Get the command type
//     const type = getCommandType(mssg.trim().toLowerCase());
//     console.log(type);
//     mssg = mssg.toLowerCase();
//     console.log(mssg);
//     switch (type) {
//       case "START": {
//         bot.telegram.sendMessage(
//           chatId,
//           `Hello ${from},\n welcome to EOD Report Sender`
//         );
//         break;
//       }
//       case "NAME": {
//         let [msg, name] = mssg.split("name");
//         const response = await updateUser(from, { userName: name.trim() });
//         if (response)
//           bot.telegram.sendMessage(chatId, "Name updated successfully");
//         break;
//       }
//       case "REGISTER": {
//         const user = await fetchUser(from);
//         if (user) return bot.telegram.sendMessage(chatId, "user already exist");
//         await createUser({ name, userName: from, email: "", pass: "" });
//         bot.telegram.sendMessage(
//           chatId,
//           "please provide email and pass for nodemailer"
//         );
//         break;
//       }
//       case "EMAIL": {
//         let [msg, email] = mssg.split("email");
//         const response = await updateUser(from, {
//           "nodemailer.email": email.trim(),
//         });
//         if (response)
//           bot.telegram.sendMessage(
//             chatId,
//             "please provide pass for nodemailer"
//           );
//         else bot.telegram.sendMessage(chatId, "User not found");
//         break;
//       }
//       case "PASS": {
//         let [msg, pass] = mssg.split("pass");
//         const response = await updateUser(from, {
//           "nodemailer.pass": pass.trim(),
//         });
//         if (response)
//           bot.telegram.sendMessage(chatId, "User registered successfully");
//         else bot.telegram.sendMessage(chatId, "User not found");
//         break;
//       }
//       case "SEND": {
//         let [send, mailContent] = mssg.split("send");
//         console.log(send, mailContent, "============SEND==============");
//         const user = await fetchUser(from);
//         if (
//           !user ||
//           !user.nodemailer.email ||
//           !user.nodemailer.pass ||
//           !user.name
//         ) {
//           bot.telegram.sendMessage(chatId, `User not found \n ${user}`);
//           break;
//         }
//         let sendMessage;
//         sendMessage = await sendEmail(user, mailContent);
//         if (sendMessage)
//           bot.telegram.sendMessage(chatId, "Mail sent successfully");
//         else bot.telegram.sendMessage(chatId, `Mail not sent for ${user.name}`);
//         break;
//       }
//       default: {
//         bot.telegram.sendMessage(chatId, "Invalid command.");
//         break;
//       }
//     }
//   } catch (error) {
//     console.log(
//       error.message,
//       "\n",
//       mssg,
//       "\n",
//       `mssg.split("send") =>`,
//       mssg.split("send"),
//       "\n",
//       "mssg.trim().toLowerCase() =>",
//       mssg.trim().toLowerCase()
//     );
//   }
// };

const handleMessage = async (name, from, mssg, bot) => {
  try {
    console.log(from, mssg);

    // Function to determine the command type using regex
    function getCommandType(message) {
      const commands = [
        { type: "START", regex: /\/start|start/i },
        { type: "REGISTER", regex: /\/register|register/i },
        { type: "EMAIL", regex: /\bemail\b/i },
        { type: "NAME", regex: /\bname\b/i },
        { type: "PASS", regex: /\bpass\b/i },
        { type: "SEND", regex: /\bsend\b/i },
      ];

      for (const command of commands) {
        if (command.regex.test(message)) {
          return command.type;
        }
      }
      return "DEFAULT";
    }

    // Function to extract key-value pairs (like name, email, pass)
    function extractParam(message, keyword) {
      const regex = new RegExp(`${keyword}\\s+(.*)`, "i");
      const match = message.match(regex);
      return match ? match[1].trim() : null;
    }

    // Get the command type
    const type = getCommandType(mssg.trim().toLowerCase());
    console.log(`Command Type: ${type}`);
    console.log(`Original Message: ${mssg}`);

    switch (type) {
      case "START": {
        await bot.telegram.sendMessage(
          chatId,
          `Hello ${from},\nWelcome to EOD Report Sender`
        );
        break;
      }

      case "NAME": {
        const nameParam = extractParam(mssg, "name");
        if (!nameParam) {
          await bot.telegram.sendMessage(
            chatId,
            "Please provide a valid name."
          );
          break;
        }

        const response = await updateUser(from, { userName: nameParam });
        if (response) {
          await bot.telegram.sendMessage(chatId, "Name updated successfully.");
        }
        break;
      }

      case "REGISTER": {
        const user = await fetchUser(from);
        if (user) {
          await bot.telegram.sendMessage(chatId, "User already exists.");
        } else {
          await createUser({ name, userName: from, email: "", pass: "" });
          await bot.telegram.sendMessage(
            chatId,
            "Please provide your email and password for nodemailer."
          );
        }
        break;
      }

      case "EMAIL": {
        const emailParam = extractParam(mssg, "email");
        if (!emailParam) {
          await bot.telegram.sendMessage(
            chatId,
            "Please provide a valid email."
          );
          break;
        }

        const response = await updateUser(from, {
          "nodemailer.email": emailParam,
        });

        if (response) {
          await bot.telegram.sendMessage(
            chatId,
            "Please provide your password for nodemailer."
          );
        } else {
          await bot.telegram.sendMessage(chatId, "User not found.");
        }
        break;
      }

      case "PASS": {
        const passParam = extractParam(mssg, "pass");
        if (!passParam) {
          await bot.telegram.sendMessage(
            chatId,
            "Please provide a valid password."
          );
          break;
        }

        const response = await updateUser(from, {
          "nodemailer.pass": passParam,
        });

        if (response) {
          await bot.telegram.sendMessage(
            chatId,
            "User registered successfully."
          );
        } else {
          await bot.telegram.sendMessage(chatId, "User not found.");
        }
        break;
      }

      case "SEND": {
        const mailContent = extractParam(mssg, "send");
        if (!mailContent) {
          await bot.telegram.sendMessage(
            chatId,
            "Please provide the content to send."
          );
          break;
        }

        const user = await fetchUser(from);
        if (
          !user ||
          !user.nodemailer?.email ||
          !user.nodemailer?.pass ||
          !user.name
        ) {
          await bot.telegram.sendMessage(
            chatId,
            `User details are incomplete or not found.`
          );
          break;
        }

        const sendMessage = await sendEmail(user, mailContent);
        if (sendMessage) {
          await bot.telegram.sendMessage(
            chatId,
            `Mail sent successfully. , 
            \n Thanks - ${user.name} `
          );
        } else {
          await bot.telegram.sendMessage(
            chatId,
            `Failed to send mail for ${user.name}.`
          );
        }
        break;
      }

      default: {
        await bot.telegram.sendMessage(chatId, "Invalid command.");
        break;
      }
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    await bot.telegram.sendMessage(
      chatId,
      "An error occurred. Please try again later."
    );
  }
};

module.exports = { handleMessage, chatId };
