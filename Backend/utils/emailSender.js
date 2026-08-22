import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const emailSender = async (email, subject, html, replyTo = null) => {
  try {
    const emailData = {
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
    };

    if (replyTo) {
      emailData.replyTo = {
        email: replyTo.email,
        name: replyTo.name,
      };
    }

    const response = await brevo.transactionalEmails.sendTransacEmail(emailData);

    console.log("Email sent successfully:", response.messageId);

    return response;
  } catch (error) {
    console.error("Brevo email error:", error?.body || error?.message || error);

    throw error;
  }
};

export default emailSender;
