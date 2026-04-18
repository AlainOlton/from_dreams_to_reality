import 'reflect-metadata'
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa'
import type { Request as ExpressRequest } from 'express'
import * as authService from '@/services/auth.service'
import type { RegisterBody, LoginBody } from '@/types/auth.types'

// ── Response shapes ───────────────────────────────────────────────────────────

/** Returned on successful registration */
export interface RegisterResponse {
  id:    string
  email: string
  role:  string
}

/** Returned on successful login */
export interface LoginResponse {
  token: string
  user: {
    id:    string
    email: string
    role:  string
  }
}

/** Generic success envelope */
export interface MessageResponse {
  success: boolean
  message: string
  data?:   unknown
}

// ── Request bodies ────────────────────────────────────────────────────────────

/** Body for POST /auth/register */
export interface RegisterRequest {
  /** User email address */
  email: string
  /** Minimum 8 characters */
  password: string
  /** One of: STUDENT | COMPANY | ACADEMIC_SUPERVISOR | SITE_SUPERVISOR | ADMIN */
  role: string
  firstName: string
  lastName:  string
  phone?:    string
}

/** Body for POST /auth/login */
export interface LoginRequest {
  email:    string
  password: string
}

/** Body for POST /auth/forgot-password */
export interface ForgotPasswordRequest {
  email: string
}

/** Body for POST /auth/reset-password */
export interface ResetPasswordRequest {
  token:    string
  /** Minimum 8 characters */
  password: string
}

// ── Controller ────────────────────────────────────────────────────────────────

@Route('api/auth')
@Tags('Auth')
export class AuthController extends Controller {

  /**
   * Register a new user account.
   * An email verification link is sent after successful registration.
   */
  @Post('register')
  @SuccessResponse(201, 'Created')
  public async register(
    @Body() body: RegisterRequest
  ): Promise<MessageResponse> {
    const result = await authService.registerUser(body as RegisterBody)
    this.setStatus(201)
    return { success: true, message: 'Registration successful. Please verify your email.', data: result }
  }

  /**
   * Authenticate with email and password.
   * Returns a JWT bearer token.
   */
  @Post('login')
  public async login(
    @Body() body: LoginRequest
  ): Promise<MessageResponse> {
    const result = await authService.loginUser(body as LoginBody)
    return { success: true, message: 'Login successful', data: result }
  }

  /**
   * Verify a user's email address using the token sent by email.
   */
  @Get('verify-email')
  public async verifyEmail(
    @Query() token: string
  ): Promise<MessageResponse> {
    await authService.verifyEmail(token)
    return { success: true, message: 'Email verified successfully' }
  }

  /**
   * Request a password reset link.
   * Always returns 200 to prevent email enumeration.
   */
  @Post('forgot-password')
  public async forgotPassword(
    @Body() body: ForgotPasswordRequest
  ): Promise<MessageResponse> {
    await authService.forgotPassword(body.email)
    return { success: true, message: 'If that email exists, a reset link has been sent' }
  }

  /**
   * Reset password using the token from the reset email.
   */
  @Post('reset-password')
  public async resetPassword(
    @Body() body: ResetPasswordRequest
  ): Promise<MessageResponse> {
    await authService.resetPassword(body.token, body.password)
    return { success: true, message: 'Password reset successfully' }
  }

  /**
   * Get the currently authenticated user's profile.
   * @summary Get current user
   */
  @Get('me')
  @Security('bearerAuth')
  public async getMe(
    @Request() req: ExpressRequest
  ): Promise<MessageResponse> {
    const user = await authService.getMe(req.user!.id)
    return { success: true, message: 'Success', data: user }
  }
}
