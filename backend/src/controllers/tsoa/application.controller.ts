import 'reflect-metadata'
import {
  Body,
  Controller,
  Get,
  Patch,
  Path,
  Post,
  Request,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa'
import type { Request as ExpressRequest } from 'express'
import * as appService from '@/services/application.service'
import type { MessageResponse } from './auth.controller'

// ── Models ────────────────────────────────────────────────────

export interface ApplyBody {
  /** Optional cover letter text (alternative to uploading a file) */
  coverLetterText?: string
}

export interface UpdateStatusBody {
  /** APPLIED | REVIEWED | INTERVIEW_SCHEDULED | ACCEPTED | REJECTED | WITHDRAWN */
  status: string
  rejectionReason?: string
}

export interface ScheduleInterviewBody {
  /** ISO 8601 datetime string */
  scheduledAt:      string
  durationMinutes?: number
  meetingLink?:     string
  location?:        string
  notes?:           string
  interviewerName?: string
}

// ── Controller ────────────────────────────────────────────────

@Route('api/applications')
@Tags('Applications')
@Security('bearerAuth')
export class ApplicationController extends Controller {

  /** Get all applications submitted by the authenticated student */
  @Get('me')
  public async getMyApplications(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const result = await appService.getMyApplications(req.user!.id)
    return { success: true, message: 'Success', data: result }
  }

  /**
   * Apply to an internship.
   * File uploads (coverLetter, cv, additionalDoc) are handled via multipart/form-data
   * in the actual endpoint — use the REST client for file uploads.
   */
  @Post('{internshipId}/apply')
  @SuccessResponse(201, 'Created')
  public async apply(
    @Path() internshipId: string,
    @Request() req: ExpressRequest,
    @Body() body: ApplyBody,
  ): Promise<MessageResponse> {
    const result = await appService.applyToInternship(req.user!.id, internshipId, {
      coverLetterText: body.coverLetterText,
    })
    this.setStatus(201)
    return { success: true, message: 'Application submitted successfully', data: result }
  }

  /** Withdraw a submitted application (Student only) */
  @Patch('{id}/withdraw')
  public async withdraw(
    @Path() id: string,
    @Request() req: ExpressRequest,
  ): Promise<MessageResponse> {
    await appService.withdrawApplication(id, req.user!.id)
    return { success: true, message: 'Application withdrawn' }
  }

  /** Get all applications for a specific internship (Company only) */
  @Get('internship/{internshipId}')
  public async getApplicationsForInternship(
    @Path() internshipId: string,
    @Request() req: ExpressRequest,
  ): Promise<MessageResponse> {
    const result = await appService.getApplicationsForInternship(internshipId, req.user!.id)
    return { success: true, message: 'Success', data: result }
  }

  /** Update application status — accept, reject, or move to review (Company only) */
  @Patch('{id}/status')
  public async updateStatus(
    @Path() id: string,
    @Request() req: ExpressRequest,
    @Body() body: UpdateStatusBody,
  ): Promise<MessageResponse> {
    const result = await appService.updateApplicationStatus(
      id,
      req.user!.id,
      body.status as any,
      body.rejectionReason,
    )
    return { success: true, message: 'Application status updated', data: result }
  }

  /** Schedule an interview for an application (Company only) */
  @Post('{id}/interview')
  public async scheduleInterview(
    @Path() id: string,
    @Request() req: ExpressRequest,
    @Body() body: ScheduleInterviewBody,
  ): Promise<MessageResponse> {
    const result = await appService.scheduleInterview(id, req.user!.id, {
      ...body,
      scheduledAt: new Date(body.scheduledAt),
    })
    return { success: true, message: 'Interview scheduled', data: result }
  }
}
