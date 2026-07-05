import nodemailer from 'nodemailer';

interface ContactData {
  name: string; email: string; subject: string; message: string;
}

function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendContactEmail(data: ContactData): Promise<void> {
  const transporter = createTransporter();

  // Email to portfolio owner
  await transporter.sendMail({
    from:    `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to:      process.env.EMAIL_TO,
    subject: `[Portfolio] ${data.subject}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#050816;color:#f0f0f0;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#00f5ff,#7928ca);padding:1.5rem">
          <h1 style="margin:0;color:#050816;font-size:1.4rem">New Portfolio Message</h1>
        </div>
        <div style="padding:2rem">
          <p><strong style="color:#00f5ff">From:</strong> ${data.name} &lt;${data.email}&gt;</p>
          <p><strong style="color:#00f5ff">Subject:</strong> ${data.subject}</p>
          <hr style="border-color:rgba(255,255,255,0.1);margin:1.5rem 0"/>
          <p style="line-height:1.7;color:#d1d5db">${data.message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>`,
  });

  // Auto-reply to sender
  await transporter.sendMail({
    from:    `"Lambo Portfolio" <${process.env.SMTP_USER}>`,
    to:      data.email,
    subject: `Thanks for reaching out, ${data.name}!`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#050816;color:#f0f0f0;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#00f5ff,#7928ca);padding:1.5rem">
          <h1 style="margin:0;color:#050816;font-size:1.4rem">Thanks for reaching out!</h1>
        </div>
        <div style="padding:2rem">
          <p>Hi <strong>${data.name}</strong>,</p>
          <p style="line-height:1.7;color:#d1d5db">
            Thank you for your message. I've received your enquiry about 
            "<em>${data.subject}</em>" and will get back to you within 24–48 hours.
          </p>
          <p style="color:#d1d5db">In the meantime, feel free to browse my projects at 
            <a href="${process.env.CLIENT_URL}" style="color:#00f5ff">${process.env.CLIENT_URL}</a>.
          </p>
          <p style="color:#9ca3af;margin-top:2rem">Best regards,<br><strong style="color:#00f5ff">Lambo</strong></p>
        </div>
      </div>`,
  });
}
