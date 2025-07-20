import nodemailer from "nodemailer";

const emailSender = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.EMAIL_SECURE),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `${process.env.EMAIL_USERNAME} <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: text,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Email sent successfully");
    }
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};

export default emailSender;
