import config from "../config/config";
import { resend } from "../utils/resend";

interface Message {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise<void>}
 */
export const sendEmail = async (
  to: string | undefined,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  console.log(["archangeltv24@gmail.com"]);
  try {
    await resend.emails.send({
      from: "Xjobs <onboarding@xjobs.io>",
      to: [String(to)],
      subject: subject,
      text: text,
      html: html,
      headers: {
        "X-Entity-Ref-ID": "123456789",
      },
      tags: [
        {
          name: "category",
          value: "confirm_email",
        },
      ],
    });
    console.log("Email Sent");
  } catch (err) {
    console.log(err);
  }
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (
  to: string,
  token: string
): Promise<void> => {
  const subject = "Reset password";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://${config.clientUrl}/reset-password?token=${token}`;
  const text = `Hi,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: ${resetPasswordUrl}</p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (
  to: string,
  token: string,
  name: string
): Promise<void> => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://${config.clientUrl}/verify-email?token=${token}`;
  const text = `Hi ${name},
  To verify your email, click on this link: ${verificationEmailUrl}
  If you did not create an account, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
  <p>If you did not create an account, then ignore this email.</p></div>`;
  // await sendEmail(to, subject, text, html);

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: to,
    subject: "Email Verification",
    html: `<h3>Hi ${name},</h3>
   <p>To verify your email, click on this link: ${verificationEmailUrl}
    If you did not create an account, then ignore this email.</p>
    <div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, click on this link: ${verificationEmailUrl}</p>
  <p>If you did not create an account, then ignore this email.</p></div>
    `,
  });
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendSuccessfulRegistration = async (
  to: string,
  token: string,
  name: string
): Promise<void> => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://${config.clientUrl}/verify-email?token=${token}`;
  const text = `Hi ${name},
  Congratulations! Your account has been created. 
  You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>You are almost there. Complete the final step by verifying your email at: ${verificationEmailUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send email verification after registration
 * @param {string} to
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendAccountCreated = async (
  to: string,
  name: string
): Promise<void> => {
  const subject = "Account Created Successfully";
  // replace this url with the link to the email verification page of your front-end app
  const loginUrl = `http://${config.clientUrl}/auth/login`;
  const text = `Hi ${name},
  Congratulations! Your account has been created successfully. 
  You can now login at: ${loginUrl}
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created successfully.</p>
  <p>You can now login at: ${loginUrl}</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team Xjobs</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

// profile update notification
export const profileUpdateNotification = async (
  to: string,
  token: string,
  name: string
): Promise<void> => {
  const subject = "Profile Update Notification";
  const text = `Hi ${name},
  Don't hesitate to contact us if you face any problems
  Regards,
  Team Xjobs`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};
// new message notification
export const newMessageNotification = async (
  to: string,
  token: string,
  name: string
): Promise<void> => {
  const subject = "New Message Notification";
  const text = `Hi ${name},
  Congratulations! . 
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team Xjobs</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};
// freelancer onboarding notification
export const freelancerOnboardingNotification = async (
  to: string,
  token: string,
  name: string
): Promise<void> => {
  const subject = "freelancer onboarding";
  const text = `Hi ${name},
  Congratulations!. 
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};
// freelancer notification
export const freelancerNotification = async (
  to: string | undefined,
  name: string | undefined
): Promise<void> => {
  const subject = "freelancer notification";
  const text = `Hi ${name},
  Congratulations! . 
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

// client notification
export const clientNotification = async (
  to: string,
  token: string,
  name: string
): Promise<void> => {
  const subject = "client notification";
  const text = `Hi ${name},
  Congratulations! generic client notification. 
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your account has been created.</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};
// gig processing
export const gigProcessing = async (
  to: string | undefined,
  name: string | undefined
): Promise<void> => {
  const subject = "Gig Processing";
  // replace this url with the link to the email verification page of your front-end app
  const text = `Hi ${name},
  Congratulations! Your Gig is currently processing. 
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your gig is now processing</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};
// refund processing
export const refundProcessing = async (
  to: string | undefined,
  name: string | undefined
): Promise<void> => {
  const subject = "Gig Processing";
  // replace this url with the link to the email verification page of your front-end app
  const text = `Hi ${name},
  Congratulations! Your Refund is currently processing. 
  Don't hesitate to contact us if you face any problems
  Regards,
  Team`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>Congratulations! Your gig is now processing</p>
  <p>Don't hesitate to contact us if you face any problems</p>
  <p>Regards,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};
