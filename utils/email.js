import nodemailer from "nodemailer";

export const sendResetEmail = async (toEmail, resetLink) => {
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   secure: false, // true for port 465
  //   auth: {
  //     user: process.env.EMAIL_USER, // your Gmail
  //     pass: process.env.EMAIL_PASS, // app password if using Gmail
  //   },
  // });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset.</p>
      <p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
