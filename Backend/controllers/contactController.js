import asyncHandler from "express-async-handler";
import emailSender from "../utils/emailSender.js";

// @DESCRIPTION Send contact form message
// @ROUTE       POST /api/contact
// @ACCESS      Public
const sendContactMessage = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !subject || !message) {
    res.status(400);
    throw new Error("Please complete all fields");
  }

  const fullName = `${firstName.trim()} ${lastName.trim()}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #161433;">
        <div style="max-width: 650px; margin: 0 auto; padding: 30px;">
          
          <h2 style="margin-bottom: 20px;">
            New Contact Form Message
          </h2>

          <p>
            You have received a new message through your website contact form.
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;" />

          <p>
            <strong>Name:</strong> ${fullName}
          </p>

          <p>
            <strong>Email:</strong> ${email}
          </p>

          <p>
            <strong>Subject:</strong> ${subject}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <div style="
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            white-space: pre-wrap;
          ">
            ${message}
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;" />

          <p style="font-size: 12px; color: #777;">
            This message was sent through the contact form on your website.
          </p>

        </div>
      </body>
    </html>
  `;

  await emailSender(process.env.EMAIL_FROM, `Contact Form: ${subject}`, html, {
    email,
    name: fullName,
  });

  res.status(200).json({
    message: "Your message has been sent successfully.",
  });
});

export { sendContactMessage };
