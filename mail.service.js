const moment = require("moment");
const nodemailer = require("nodemailer");
const { fetch, create } = require("./service/eod.service");
const createTransporter = async (user) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user.nodemailer.email, // your email user
      pass: user.nodemailer.pass, // your email password
    },
  });

  return transporter;
};
/**
 * Send an email using nodemailer
 * @param {Object} mailOptions - Email details (to, subject, text, html, attachments)
 */
const sendEmail = async (user, mailContent) => {
  try {
    const subject = `EOD Report | ${user.name} | Tech | ${moment().format(
      "DD MMM YY - dddd"
    )}`;

    // Create a transporter object
    let transporter = await createTransporter(user);

    // Setup email options
    let options = {
      from: user.nodemailer.email, // sender email
      to: "naveen@zeltatech.com",
      cc: "HR@zeltatech.com", // recipient email(s)
      // to: "bhaveshg0402@gmail.com",
      subject, // email subject
      //   text: mailOptions.text || "", // plain text body
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
      <td>${moment().format("DD/MM/YYYY")}</td>
      <td>${mailContent}</td>
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
      // html body
      //   attachments: mailOptions.attachments || [], // optional attachments
    };

    // Send mail with defined transport object
    let info = await transporter.sendMail(options);
    console.log(`Message sent: ${info.messageId}`);
    await create({ user: user._id, message: mailContent });
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    return null;
  }
};

module.exports = {
  sendEmail,
};
