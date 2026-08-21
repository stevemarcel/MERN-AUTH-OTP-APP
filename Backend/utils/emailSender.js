import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const emailSender = async (email, subject, html) => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.EMAIL_FROM_NAME,
        email: process.env.EMAIL_FROM,
      },
      to: [
        {
          email,
        },
      ],
      subject,
      htmlContent: html,
    });

    console.log("Email sent successfully:", response.messageId);

    return response;
  } catch (error) {
    console.error("Brevo email error:", error?.body || error?.message || error);

    throw error;
  }
};

export default emailSender;
