import nodemailer from "nodemailer";

// For create email obj to send actual emails.
export default class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;
  constructor(user: { email: string; name: string }, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `xjobs <${process.env.EMAIL_FROM}>`;
  }

  // Create different transports for different environments
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      // port: process.env.EMAIL_PORT,
      // auth: {
      //   user: process.env.EMAIL_USERNAME,
      //   pass: process.env.EMAIL_PASSWORD,
      // },
    });
  }

  // Send the actual email
  async send(template: string, subject: string) {
    // 1) Render HTML based on a pug template
    let html;

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the XJobs Family!");
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
  async sendVerificationMail() {}
  async gigProcessing() {}
  async clientNotification() {}
  async FreelancerNotification() {}
}

// new Email().send({
//   from: "support@xjobs.io",
//   to: userExists.email_address,
//   subject: "Details updated!",
//   text: "Great news! Your profile has been updated successfully. ",
// });

// new Email().send({
//   from: "support@xjobs.io",
//   to: newUser.email_address,
//   subject: "Welcome to XJobs!",
//   text: `Dear ${newUser.name},

//   Welcome to XJobs! Our platform connects you with skilled freelancers and clients in the Web3 community. We offer an easy-to-use interface and smart contract-based escrow to ensure secure and seamless transactions.

//   If you have any questions or concerns, please contact us at support@xjobs.io.

//   Best regards,
//   The XJobs team`,
// }),

// new Email().send({
//   from: "support@xjobs.io",
//   to: userExists.email_address,
//   subject: "Details updated!",
//   text: "Great news! Your profile has been updated successfully. ",
// }),

// new Email().send({
//   from: "support@xjobs.io",
//   to: user.email_address,
//   subject: "you have a new message!",
//   text:
//     "Hey there! You have got a new message waiting for you. Log in to your account to check it out",
// });
// new Email().send("a subject", "a title");
