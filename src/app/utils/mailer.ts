import nodemailer from "nodemailer";

// For create email obj to send actual emails.
export default class Email {
  to: string;
  firstName: string;
  from: string;
  constructor(user: { email: string; name: string }) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
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

  async send(text: string, subject: string) {
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: `Dear ${this.firstName}, ${text}`,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the XJobs Family!");
  }

  async sendVerificationMail() {
    await this.send(
      "verificationMail",
      "Verify that you own this email address"
    );
  }

  async gigProcessing() {
    await this.send("gigProcessing", "this gig is currently processing");
  }

  async clientNotification() {
    await this.send("clientNotification", "Welcome to Xjobs");
  }

  async FreelancerNotification() {
    await this.send(
      "FreelancerNotification",
      "Generic Freelancer Notification"
    );
  }

  // profile notification
  // gig notification
  // new message notification
  // proposal nnotification
}

// TODO

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
