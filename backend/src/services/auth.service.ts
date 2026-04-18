import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'
import { prisma } from '@/config/db'
import { generateToken, generateShortToken } from '@/utils/generateToken'
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '@/services/email.service'
import { RegisterBody, LoginBody } from '@/types/auth.types'

export const registerUser = async (body: RegisterBody) => {
  const { email, password, role, firstName, lastName, phone } = body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('Email already registered')

  const hashed     = await bcrypt.hash(password, 12)
  const emailToken = generateShortToken()

  const user = await prisma.user.create({
    data: {
      email,
      password:         hashed,
      role,
      emailVerifyToken: emailToken,
    },
  })

  // Create role-specific profile
  if (role === Role.STUDENT) {
    await prisma.studentProfile.create({
      data: { userId: user.id, firstName, lastName, phone },
    })
  } else if (role === Role.ACADEMIC_SUPERVISOR || role === Role.SITE_SUPERVISOR) {
    await prisma.supervisorProfile.create({
      data: { userId: user.id, firstName, lastName, phone },
    })
  } else if (role === Role.COMPANY) {
    await prisma.companyProfile.create({
      data: { userId: user.id, companyName: firstName },
    })
  } else if (role === Role.ADMIN) {
    await prisma.adminProfile.create({
      data: { userId: user.id, firstName, lastName },
    })
  }

  await sendVerificationEmail(email, emailToken)

  const token = generateToken({ id: user.id, email: user.email, role: user.role })
  return { token, role: user.role, id: user.id }
}

export const loginUser = async (body: LoginBody) => {
  const { email, password } = body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })

  if (!user.isActive) throw Object.assign(new Error('Account deactivated'), { statusCode: 403 })

  await prisma.user.update({
    where: { id: user.id },
    data:  { lastLoginAt: new Date() },
  })

  const token = generateToken({ id: user.id, email: user.email, role: user.role })
  return { token, role: user.role, id: user.id, isEmailVerified: user.isEmailVerified }
}

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: { emailVerifyToken: token },
  })
  if (!user) throw Object.assign(new Error('Invalid or expired verification link'), { statusCode: 400 })

  await prisma.user.update({
    where: { id: user.id },
    data:  { isEmailVerified: true, emailVerifyToken: null },
  })
}

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  // Always return success to prevent email enumeration
  if (!user) return

  const resetToken  = generateShortToken()
  const resetExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data:  { passwordResetToken: resetToken, passwordResetExpiry: resetExpiry },
  })

  await sendPasswordResetEmail(email, resetToken)
}

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken:  token,
      passwordResetExpiry: { gt: new Date() },
    },
  })
  if (!user) throw Object.assign(new Error('Invalid or expired reset link'), { statusCode: 400 })

  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({
    where: { id: user.id },
    data:  {
      password:           hashed,
      passwordResetToken:  null,
      passwordResetExpiry: null,
    },
  })
}

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: {
      id:              true,
      email:           true,
      role:            true,
      isEmailVerified: true,
      createdAt:       true,
      studentProfile:  { select: { firstName: true, lastName: true, profilePhotoUrl: true } },
      supervisorProfile: { select: { firstName: true, lastName: true, profilePhotoUrl: true } },
      companyProfile:  { select: { companyName: true, logoUrl: true } },
      adminProfile:    { select: { firstName: true, lastName: true } },
    },
  })
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })
  return user
}
