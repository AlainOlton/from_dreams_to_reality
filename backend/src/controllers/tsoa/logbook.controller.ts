import 'reflect-metadata'
import {
  Body,
  Controller,
  Get,
  Patch,
  Path,
  Post,
  Put,
  Query,
  Request,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa'
import type { Request as ExpressRequest } from 'express'
import * as logbookService from '@/services/logbook.service'
import type { MessageResponse } from './auth.controller'

// ── Models ────────────────────────────────────────────────────

export interface LogbookEntryBody {
  /** DAILY | WEEKLY */
  frequency:       string
  /** ISO 8601 date string */
  entryDate:       string
  weekNumber?:     number
  activitiesDone:  string
  skillsGained?:   string
  challenges?:     string
  nextWeekPlan?:   string
  enrollmentId?:   string
}

export interface ApproveEntryBody {
  /** Optional supervisor note */
  note?: string
}

export interface AttendanceBody {
  /** ISO 8601 date string */
  date:          string
  /** PRESENT | ABSENT | LATE | EXCUSED */
  status:        string
  checkInTime?:  string
  checkOutTime?: string
  hoursLogged?:  number
  note?:         string
  enrollmentId?: string
}

// ── Controller ────────────────────────────────────────────────

@Route('api/logbook')
@Tags('Logbook')
@Security('bearerAuth')
export class LogbookController extends Controller {

  /** Get all logbook entries for the authenticated student */
  @Get('me')
  public async getMyEntries(
    @Request() req: ExpressRequest,
    @Query() page?:  number,
    @Query() limit?: number,
  ): Promise<MessageResponse> {
    const result = await logbookService.getMyEntries(req.user!.id, { page, limit } as any)
    return { success: true, message: 'Success', data: result }
  }

  /**
   * Create a new logbook entry (Student only).
   * File attachment is handled via multipart/form-data in the actual endpoint.
   */
  @Post('/')
  @SuccessResponse(201, 'Created')
  public async createEntry(
    @Request() req: ExpressRequest,
    @Body() body: LogbookEntryBody,
  ): Promise<MessageResponse> {
    const result = await logbookService.createEntry(req.user!.id, body as any)
    this.setStatus(201)
    return { success: true, message: 'Logbook entry created', data: result }
  }

  /** Update an existing logbook entry (Student only) */
  @Put('{id}')
  public async updateEntry(
    @Path() id: string,
    @Request() req: ExpressRequest,
    @Body() body: Partial<LogbookEntryBody>,
  ): Promise<MessageResponse> {
    const result = await logbookService.updateEntry(id, req.user!.id, body as any)
    return { success: true, message: 'Entry updated', data: result }
  }

  /** Get logbook entries for a specific student (Supervisor / Admin) */
  @Get('student/{studentId}')
  public async getStudentEntries(
    @Path() studentId: string,
    @Request() req: ExpressRequest,
    @Query() page?:  number,
    @Query() limit?: number,
  ): Promise<MessageResponse> {
    const result = await logbookService.getStudentEntries(studentId, req.user!.id, { page, limit } as any)
    return { success: true, message: 'Success', data: result }
  }

  /** Approve a logbook entry (Supervisor only) */
  @Patch('{id}/approve')
  public async approveEntry(
    @Path() id: string,
    @Request() req: ExpressRequest,
    @Body() body: ApproveEntryBody,
  ): Promise<MessageResponse> {
    const result = await logbookService.approveEntry(id, req.user!.id, body.note)
    return { success: true, message: 'Entry approved', data: result }
  }

  /** Get attendance summary for the authenticated student */
  @Get('attendance/me')
  public async getAttendanceSummary(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const result = await logbookService.getAttendanceSummary(req.user!.id)
    return { success: true, message: 'Success', data: result }
  }

  /** Log attendance for a student (Site Supervisor / Admin) */
  @Post('attendance')
  public async logAttendance(
    @Request() req: ExpressRequest,
    @Body() body: AttendanceBody,
  ): Promise<MessageResponse> {
    const result = await logbookService.logAttendance(req.user!.id, {
      ...body,
      date: new Date(body.date),
    } as any)
    return { success: true, message: 'Attendance logged', data: result }
  }
}
