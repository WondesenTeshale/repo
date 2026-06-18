import nodemailer from "nodemailer";

interface EmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification({ name, email, subject, message }: EmailParams): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  // Custom sender and receiver from environment variables or defaults
  const fromEmail = process.env.SMTP_FROM || "notifications@betterdose.dev";
  const toEmail = process.env.CONTACT_RECEIVER_EMAIL || "contact@betterdose.dev";

  console.log(`[Email Utility] Checking SMTP configuration for: ${toEmail}`);

  if (!host || !user || !pass) {
    console.log("------------------------------------------------------------");
    console.log("[EMAIL NOTIFICATION MOCK - SMTP NOT CONFIGURED]");
    console.log(`To:      ${toEmail}`);
    console.log(`From:    "${name}" <${email}>`);
    console.log(`Subject: Contact Form: ${subject || "No Subject"}`);
    console.log(`Message: ${message}`);
    console.log("------------------------------------------------------------");
    return true; // Return true as mock success
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: `"${name} (via BetterDose)" <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: `New Contact Submission: ${subject || "General Inquiry"}`,
      text: `
New message received from the BetterDose Contact Form:

From: ${name} <${email}>
Subject: ${subject || "General Inquiry"}
Date: ${new Date().toLocaleString()}

Message:
------------------------------------------------------------
${message}
------------------------------------------------------------
      `,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #1e293b; line-height: 1.5;">
          <h2 style="color: #4f8ef7; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">New Contact Submission</h2>
          <p>You received a new message from the BetterDose Contact Form.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 6px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 6px 0;">${subject || "General Inquiry"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Received:</td>
              <td style="padding: 6px 0;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 16px;">
            <strong style="display: block; margin-bottom: 8px;">Message:</strong>
            <p style="margin: 0; white-space: pre-wrap; color: #334155;">${message}</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Utility] Notification sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("[Email Utility] Error sending notification email:", error);
    return false;
  }
}
