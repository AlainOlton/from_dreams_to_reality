import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:       process.env.EMAIL_HOST ?? 'smtp.gmail.com',
  port:       parseInt(process.env.EMAIL_PORT ?? '587'),
  secure:     false,   // STARTTLS on port 587
  requireTLS: true,    // Force STARTTLS upgrade — required for Gmail App Passwords
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
  tls: {
    rejectUnauthorized: false,  // tolerate self-signed certs in dev
  },
})

interface MailOptions {
  to:      string
  subject: string
  html:    string
}

export const sendEmail = async (options: MailOptions): Promise<void> => {
  await transporter.sendMail({
    from:    `"Internship System" <${process.env.EMAIL_USER}>`,
    to:      options.to,
    subject: options.subject,
    html:    options.html,
  })
}

// ── Pre-built email templates ──────────────────────────────

export const sendVerificationEmail = async (
  to:    string,
  token: string
): Promise<void> => {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`
  await sendEmail({
    to,
    subject: 'Verify your email — Internship System',
    html: `
      <h2>Welcome to the Internship Connection and Tracking System</h2>
      <p>Click the button below to verify your email address.</p>
      <a href="${url}" style="
        display:inline-block;padding:12px 24px;
        background:#1D9E75;color:#fff;
        border-radius:8px;text-decoration:none;font-weight:500">
        Verify Email
      </a>
      <p style="color:#888;font-size:12px;margin-top:16px">
        This link expires in 24 hours. If you did not create an account, ignore this email.
      </p>`,
  })
}

export const sendPasswordResetEmail = async (
  to:    string,
  token: string
): Promise<void> => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`
  await sendEmail({
    to,
    subject: 'Password reset request — Internship System',
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password. This link expires in 1 hour.</p>
      <a href="${url}" style="
        display:inline-block;padding:12px 24px;
        background:#534AB7;color:#fff;
        border-radius:8px;text-decoration:none;font-weight:500">
        Reset Password
      </a>
      <p style="color:#888;font-size:12px;margin-top:16px">
        If you did not request this, you can safely ignore this email.
      </p>`,
  })
}

export const sendOtpEmail = async (
  to:   string,
  name: string,
  otp:  string
): Promise<void> => {
  await sendEmail({
    to,
    subject: 'Your InternHub login verification code',
    html: `
      <div style="font-family:'DM Sans',Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#e8f7fb;border-radius:16px">
        <div style="text-align:center;margin-bottom:28px">
          <div style="display:inline-flex;align-items:center;gap:8px">
            <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#0dcaf0,#0aa8cc);display:inline-flex;align-items:center;justify-content:center">
              <span style="font-size:18px">🎓</span>
            </div>
            <span style="font-family:Georgia,serif;font-size:1.4rem;font-weight:700;color:#0d1a26">Intern<span style="color:#0dcaf0">Hub</span></span>
          </div>
        </div>
        <div style="background:#fff;border-radius:14px;padding:28px;border:1px solid rgba(13,202,240,0.15);box-shadow:0 4px 20px rgba(13,202,240,0.08)">
          <h2 style="font-family:Georgia,serif;font-size:1.4rem;color:#0d1a26;margin:0 0 8px">Hi ${name},</h2>
          <p style="color:#5a8fa3;font-size:0.9rem;margin:0 0 24px">Use the code below to complete your sign-in. This code expires in <strong>10 minutes</strong>.</p>
          <div style="text-align:center;margin:28px 0">
            <div style="display:inline-block;background:linear-gradient(135deg,#0dcaf0,#0aa8cc);border-radius:12px;padding:18px 40px">
              <span style="font-family:'Courier New',monospace;font-size:2.2rem;font-weight:700;color:#fff;letter-spacing:0.3em">${otp}</span>
            </div>
          </div>
          <p style="color:#9bbfcc;font-size:0.78rem;text-align:center;margin:0">If you did not attempt to log in, you can safely ignore this email. Your account is secure.</p>
        </div>
        <p style="color:#9bbfcc;font-size:0.72rem;text-align:center;margin-top:20px">© ${new Date().getFullYear()} InternHub — Internship Connection and Tracking System</p>
      </div>`,
  })
}

export const sendApplicationStatusEmail = async (
  to:          string,
  firstName:   string,
  companyName: string,
  status:      string
): Promise<void> => {
  const statusColors: Record<string, string> = {
    ACCEPTED:            '#1D9E75',
    REJECTED:            '#E24B4A',
    INTERVIEW_SCHEDULED: '#534AB7',
    REVIEWED:            '#BA7517',
  }
  const color = statusColors[status] ?? '#888'
  await sendEmail({
    to,
    subject: `Application update from ${companyName}`,
    html: `
      <h2>Hi ${firstName},</h2>
      <p>Your application to <strong>${companyName}</strong> has been updated.</p>
      <p style="font-size:18px;font-weight:500;color:${color}">${status.replace('_', ' ')}</p>
      <p>Log in to your dashboard for full details.</p>`,
  })
}
