import nodemailer from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

// Create transporter using AWS SES SDK or fallback to SMTP settings
export const getTransporter = () => {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";

  // Fallback to SMTP/Gmail if AWS credentials are not configured yet
  if (!accessKeyId || !secretAccessKey) {
    console.warn("⚠️ AWS SES credentials are not fully configured. Falling back to Gmail SMTP.");
    const host = "smtp.gmail.com";
    const port = 587;
    const user = "harshsoaring@gmail.com";
    const pass = "towi guhv yhxh wewm";

    return nodemailer.createTransport({
      host: host,
      port: port,
      secure: false,
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  const sesClient = new SESv2Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return nodemailer.createTransport({
    SES: { sesClient, SendEmailCommand },
  });
};

export async function sendSubmissionEmail(submission) {
  const { type, name, phone, email, subject, program, message } = submission;

  const targetEmail = "info@soaringaerotech.com";
  const transporter = getTransporter();

  // Create clean email Subject
  const mailSubject = `New Web Form Submission: ${type.toUpperCase()} - ${name}`;

  // Build clean HTML content
  let detailsHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 8px;">
      <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 8px; margin-top: 0;">New Web Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #4a5568;">Form Type:</td>
          <td style="padding: 8px 0; color: #1a202c; text-transform: uppercase; font-weight: 600;">${type}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Name:</td>
          <td style="padding: 8px 0; color: #1a202c;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Phone:</td>
          <td style="padding: 8px 0; color: #1a202c;">
            <a href="tel:${phone}" style="color: #ef4444; text-decoration: none;">${phone}</a>
          </td>
        </tr>
  `;

  if (email) {
    detailsHtml += `
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Email:</td>
        <td style="padding: 8px 0; color: #1a202c;">
          <a href="mailto:${email}" style="color: #ef4444; text-decoration: none;">${email}</a>
        </td>
      </tr>
    `;
  }

  if (subject) {
    detailsHtml += `
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Inquiry Type:</td>
        <td style="padding: 8px 0; color: #1a202c;">${subject}</td>
      </tr>
    `;
  }

  if (program) {
    detailsHtml += `
      <tr>
        <td style="padding: 8px 0; font-weight: bold; color: #4a5568;">Requested Program:</td>
        <td style="padding: 8px 0; color: #1a202c;">${program}</td>
      </tr>
    `;
  }

  detailsHtml += `
      </table>
  `;

  if (message) {
    detailsHtml += `
      <div style="margin-top: 20px; padding: 15px; bg-color: #f7fafc; border-left: 4px solid #cbd5e0; background-color: #f8fafc; border-radius: 4px;">
        <h4 style="margin: 0 0 8px 0; color: #4a5568;">User Message:</h4>
        <p style="margin: 0; color: #2d3748; line-height: 1.5; white-space: pre-wrap;">${message}</p>
      </div>
    `;
  }

  detailsHtml += `
      <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #a0aec0; text-align: center;">
        This email was automatically generated from the Soaring Aerotech website form.
      </div>
    </div>
  `;

  const senderEmail = process.env.SES_SENDER_EMAIL || "harshsoaring@gmail.com";
  const mailOptions = {
    from: `"Soaring Aerotech Web" <${senderEmail}>`,
    to: targetEmail,
    subject: mailSubject,
    html: detailsHtml,
  };

  if (email) {
    mailOptions.replyTo = email;
  }

  if (!transporter) {
    console.log("\n-----------------------------------------");
    console.log("MOCK EMAIL GENERATED (SMTP NOT CONFIGURED)");
    console.log("TO:", targetEmail);
    console.log("Subject:", mailSubject);
    console.log("Content:", detailsHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
    console.log("-----------------------------------------\n");
    return { success: true, mocked: true };
  }

  try {
    console.log("📨 Sending email with options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      replyTo: mailOptions.replyTo
    });
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email successfully sent to ${targetEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending submission email:", error);
    return { success: false, error };
  }
}
