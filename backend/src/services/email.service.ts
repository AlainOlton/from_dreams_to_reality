import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST!,
  port:   parseInt(process.env.EMAIL_PORT ?? '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
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
      <h2>Welcome to the Internship Monitoring System</h2>
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
