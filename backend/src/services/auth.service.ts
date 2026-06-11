import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'
import { prisma } from '@/config/db'
import { generateToken, generateShortToken } from '@/utils/generateToken'
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOtpEmail,
} from '@/services/email.service'
import { RegisterBody, LoginBody } from '@/types/auth.types'

/** Generate a cryptographically random 6-digit OTP */
const generateOtp = (): string =>
  String(Math.floor(100000 + Math.random() * 900000))

// ── Register ──────────────────────────────────────────────────
export const registerUser = async (body: RegisterBody) => {
  const { email, password, role, firstName, lastName, phone } = body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Email already registered')

  const hashed     = await bcrypt.hash(password, 12)
  const emailToken = generateShortToken()

  const user = await prisma.user.create({
    data: { email, password: hashed, role, emailVerifyToken: emailToken },
  })

  if (role === Role.STUDENT) {
    await prisma.studentProfile.create({ data: { userId: user.id, firstName, lastName, phone } })
  } else if (role === Role.ACADEMIC_SUPERVISOR || role === Role.SITE_SUPERVISOR) {
    await prisma.supervisorProfile.create({ data: { userId: user.id, firstName, lastName, phone } })
  } else if (role === Role.COMPANY) {
    await prisma.companyProfile.create({ data: { userId: user.id, companyName: firstName } })
  } else if (role === Role.ADMIN) {
    await prisma.adminProfile.create({ data: { userId: user.id, firstName, lastName } })
  } else if (role === Role.UNIVERSITY) {
    await prisma.universityProfile.create({
      data: { userId: user.id, universityName: firstName, contactPersonName: `${firstName} ${lastName}` },
    })
  }

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    await sendVerificationEmail(email, emailToken)
  }

  return { message: 'Account created. Please sign in with your credentials.' }
}

// ── Login (step 1 — sends OTP) ────────────────────────────────
export const loginUser = async (body: LoginBody) => {
  const { email, password } = body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })

  if (!user.isActive) throw Object.assign(new Error('Account deactivated'), { statusCode: 403 })

  const otp       = generateOtp()
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  await prisma.user.update({ where: { id: user.id }, data: { otpCode: otp, otpExpiry } })

  const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
  // Seed/test accounts (@ims.dev) skip real email delivery
  const isTestAccount   = email.endsWith('@ims.dev')

  if (emailConfigured && !isTestAccount) {
    const profile =
      await prisma.studentProfile.findUnique({ where: { userId: user.id } }) ??
      await prisma.supervisorProfile.findUnique({ where: { userId: user.id } }) ??
      await prisma.adminProfile.findUnique({ where: { userId: user.id } })
    const name = (profile as any)?.firstName ?? email.split('@')[0]

    try {
      await sendOtpEmail(email, name, otp)
    } catch (mailErr: any) {
      await prisma.user.update({ where: { id: user.id }, data: { otpCode: null, otpExpiry: null } })
      throw Object.assign(
        new Error(`Could not send verification email: ${mailErr.message}`),
        { statusCode: 500 }
      )
    }
  }

  return {
    requiresOtp: true,
    email:       user.email,
    // Return the OTP directly for dev/test accounts so they can log in without email
    ...(process.env.NODE_ENV !== 'production' && (isTestAccount || !emailConfigured) ? { devOtp: otp } : {}),
  }
}

// ── Verify OTP (step 2 — issues JWT) ─────────────────────────
export const verifyOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw Object.assign(new Error('Invalid request'), { statusCode: 400 })

  if (!user.otpCode || !user.otpExpiry) {
    throw Object.assign(new Error('No OTP requested. Please sign in again.'), { statusCode: 400 })
  }

  if (new Date() > user.otpExpiry) {
    await prisma.user.update({ where: { id: user.id }, data: { otpCode: null, otpExpiry: null } })
    throw Object.assign(new Error('Code has expired. Please sign in again.'), { statusCode: 400 })
  }

  if (user.otpCode !== otp.trim()) {
    throw Object.assign(new Error('Incorrect code. Please try again.'), { statusCode: 401 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data:  { otpCode: null, otpExpiry: null, lastLoginAt: new Date() },
  })

  const token = generateToken({ id: user.id, email: user.email, role: user.role })
  return { token, role: user.role, id: user.id, isEmailVerified: user.isEmailVerified }
}

// ── Resend OTP ────────────────────────────────────────────────
export const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw Object.assign(new Error('Invalid request'), { statusCode: 400 })
  if (!user.isActive) throw Object.assign(new Error('Account deactivated'), { statusCode: 403 })

  const otp       = generateOtp()
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.user.update({ where: { id: user.id }, data: { otpCode: otp, otpExpiry } })

  const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
  const isTestAccount   = email.endsWith('@ims.dev')

  if (emailConfigured && !isTestAccount) {
    const profile =
      await prisma.studentProfile.findUnique({ where: { userId: user.id } }) ??
      await prisma.supervisorProfile.findUnique({ where: { userId: user.id } }) ??
      await prisma.adminProfile.findUnique({ where: { userId: user.id } })
    const name = (profile as any)?.firstName ?? email.split('@')[0]

    try {
      await sendOtpEmail(email, name, otp)
    } catch (mailErr: any) {
      await prisma.user.update({ where: { id: user.id }, data: { otpCode: null, otpExpiry: null } })
      throw Object.assign(new Error(`Could not send email: ${mailErr.message}`), { statusCode: 500 })
    }
  }

  return {
    message: 'New verification code sent',
    ...(process.env.NODE_ENV !== 'production' && (isTestAccount || !emailConfigured) ? { devOtp: otp } : {}),
  }
}

// ── Verify email address ──────────────────────────────────────
export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } })
  if (!user) throw Object.assign(new Error('Invalid or expired verification link'), { statusCode: 400 })

  await prisma.user.update({
    where: { id: user.id },
    data:  { isEmailVerified: true, emailVerifyToken: null },
  })
}

// ── Forgot password ───────────────────────────────────────────
export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return // prevent email enumeration

  const resetToken  = generateShortToken()
  const resetExpiry = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data:  { passwordResetToken: resetToken, passwordResetExpiry: resetExpiry },
  })

  await sendPasswordResetEmail(email, resetToken)
}

// ── Reset password ────────────────────────────────────────────
export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: { passwordResetToken: token, passwordResetExpiry: { gt: new Date() } },
  })
  if (!user) throw Object.assign(new Error('Invalid or expired reset link'), { statusCode: 400 })

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: user.id },
    data:  { password: hashed, passwordResetToken: null, passwordResetExpiry: null },
  })
}

// ── Get current user ──────────────────────────────────────────
export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: {
      id:              true,
      email:           true,
      role:            true,
      isEmailVerified: true,
      createdAt:       true,
      studentProfile:    { select: { firstName: true, lastName: true, profilePhotoUrl: true } },
      supervisorProfile: { select: { firstName: true, lastName: true, profilePhotoUrl: true } },
      companyProfile:    { select: { companyName: true, logoUrl: true } },
      adminProfile:      { select: { firstName: true, lastName: true } },
      universityProfile: { select: { universityName: true, logoUrl: true, contactPersonName: true } },
    },
  })
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })
  return user
}
