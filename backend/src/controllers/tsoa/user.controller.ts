import 'reflect-metadata'
import {
  Body,
  Controller,
  Get,
  Patch,
  Path,
  Post,
  Put,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa'
import type { Request as ExpressRequest } from 'express'
import { prisma } from '@/config/db'
import type { MessageResponse } from './auth.controller'

// ── Models ────────────────────────────────────────────────────

export interface StudentProfileBody {
  firstName?:    string
  lastName?:     string
  phone?:        string
  studentId?:    string
  department?:   string
  faculty?:      string
  yearOfStudy?:  number
  institution?:  string
  bio?:          string
  skills?:       string[]
}

export interface SupervisorProfileBody {
  firstName?:       string
  lastName?:        string
  phone?:           string
  title?:           string
  department?:      string
  institution?:     string
  specialization?:  string
}

export interface CompanyProfileBody {
  companyName?:  string
  industry?:     string
  description?:  string
  website?:      string
  phone?:        string
  email?:        string
  addressLine1?: string
  addressLine2?: string
  city?:         string
  country?:      string
  latitude?:     number
  longitude?:    number
}

// ── Controller ────────────────────────────────────────────────

@Route('api/users')
@Tags('Users')
@Security('bearerAuth')
export class UserController extends Controller {

  // ── Student ──────────────────────────────────────────────────

  /** Get the authenticated student's profile */
  @Get('student/me')
  public async getStudentProfile(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.id } })
    return { success: true, message: 'Success', data: profile }
  }

  /** Update the authenticated student's profile */
  @Put('student/me')
  public async updateStudentProfile(
    @Request() req: ExpressRequest,
    @Body() body: StudentProfileBody,
  ): Promise<MessageResponse> {
    const profile = await prisma.studentProfile.update({
      where: { userId: req.user!.id },
      data:  body,
    })
    return { success: true, message: 'Profile updated', data: profile }
  }

  /**
   * Upload a profile photo for the student.
   * Send as multipart/form-data with field name `photo`.
   */
  @Post('student/me/photo')
  public async uploadStudentPhoto(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const photoUrl = (req.file as any)?.path
    const profile  = await prisma.studentProfile.update({
      where: { userId: req.user!.id },
      data:  { profilePhotoUrl: photoUrl },
    })
    return { success: true, message: 'Profile photo updated', data: profile }
  }

  /**
   * Upload a CV document for the student.
   * Send as multipart/form-data with field name `cv`.
   */
  @Post('student/me/cv')
  public async uploadStudentCv(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const cvUrl   = (req.file as any)?.path
    const profile = await prisma.studentProfile.update({
      where: { userId: req.user!.id },
      data:  { cvUrl },
    })
    return { success: true, message: 'CV uploaded', data: profile }
  }

  // ── Supervisor ───────────────────────────────────────────────

  /** Get the authenticated supervisor's profile */
  @Get('supervisor/me')
  public async getSupervisorProfile(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const profile = await prisma.supervisorProfile.findUnique({ where: { userId: req.user!.id } })
    return { success: true, message: 'Success', data: profile }
  }

  /** Update the authenticated supervisor's profile */
  @Put('supervisor/me')
  public async updateSupervisorProfile(
    @Request() req: ExpressRequest,
    @Body() body: SupervisorProfileBody,
  ): Promise<MessageResponse> {
    const profile = await prisma.supervisorProfile.update({
      where: { userId: req.user!.id },
      data:  body,
    })
    return { success: true, message: 'Profile updated', data: profile }
  }

  // ── Company ──────────────────────────────────────────────────

  /** Get the authenticated company's profile */
  @Get('company/me')
  public async getCompanyProfile(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const profile = await prisma.companyProfile.findUnique({ where: { userId: req.user!.id } })
    return { success: true, message: 'Success', data: profile }
  }

  /** Update the authenticated company's profile */
  @Put('company/me')
  public async updateCompanyProfile(
    @Request() req: ExpressRequest,
    @Body() body: CompanyProfileBody,
  ): Promise<MessageResponse> {
    const profile = await prisma.companyProfile.update({
      where: { userId: req.user!.id },
      data:  body,
    })
    return { success: true, message: 'Company profile updated', data: profile }
  }

  /**
   * Upload a company logo.
   * Send as multipart/form-data with field name `logo`.
   */
  @Post('company/me/logo')
  public async uploadCompanyLogo(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const logoUrl = (req.file as any)?.path
    const profile = await prisma.companyProfile.update({
      where: { userId: req.user!.id },
      data:  { logoUrl },
    })
    return { success: true, message: 'Logo uploaded', data: profile }
  }

  // ── Admin ────────────────────────────────────────────────────

  /** List all users (Admin only) */
  @Get('/')
  public async listUsers(): Promise<MessageResponse> {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, role: true,
        isActive: true, isEmailVerified: true, createdAt: true,
        studentProfile:    { select: { firstName: true, lastName: true } },
        supervisorProfile: { select: { firstName: true, lastName: true } },
        companyProfile:    { select: { companyName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return { success: true, message: 'Success', data: users }
  }

  /** Toggle a user's active status (Admin only) */
  @Patch('{id}/toggle-active')
  public async toggleUserActive(@Path() id: string): Promise<MessageResponse> {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) { this.setStatus(404); return { success: false, message: 'User not found' } }
    const updated = await prisma.user.update({
      where: { id },
      data:  { isActive: !user.isActive },
    })
    return {
      success: true,
      message: `User ${updated.isActive ? 'activated' : 'deactivated'}`,
      data: { isActive: updated.isActive },
    }
  }
}
