import 'reflect-metadata'
import {
  Body,
  Controller,
  Delete,
  Get,
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
import * as internshipService from '@/services/internship.service'
import { prisma } from '@/config/db'
import type { MessageResponse } from './auth.controller'

// ── Models ────────────────────────────────────────────────────

export interface InternshipBody {
  title:               string
  description:         string
  /** ACADEMIC | PROFESSIONAL */
  type:                string
  field:               string
  location?:           string
  city?:               string
  country?:            string
  latitude?:           number
  longitude?:          number
  isRemote?:           boolean
  isPaid?:             boolean
  stipendAmount?:      number
  currency?:           string
  durationWeeks?:      number
  startDate?:          string
  endDate?:            string
  applicationDeadline?: string
  slots?:              number
  requirements?:       string[]
  responsibilities?:   string[]
  skills?:             string[]
}

export interface InternshipListQuery {
  page?:     number
  limit?:    number
  type?:     string
  field?:    string
  city?:     string
  isRemote?: boolean
  isPaid?:   boolean
  search?:   string
}

// ── Controller ────────────────────────────────────────────────

@Route('api/internships')
@Tags('Internships')
export class InternshipController extends Controller {

  /** Browse all open internship listings (public) */
  @Get('/')
  public async listInternships(
    @Query() page?:     number,
    @Query() limit?:    number,
    @Query() type?:     string,
    @Query() field?:    string,
    @Query() city?:     string,
    @Query() isRemote?: boolean,
    @Query() isPaid?:   boolean,
    @Query() search?:   string,
  ): Promise<MessageResponse> {
    const result = await internshipService.listInternships({ page, limit, type, field, city, isRemote, isPaid, search } as any)
    return { success: true, message: 'Success', data: result }
  }

  /** Get a single internship by ID (public) */
  @Get('{id}')
  public async getInternship(@Path() id: string): Promise<MessageResponse> {
    const result = await internshipService.getInternshipById(id)
    return { success: true, message: 'Success', data: result }
  }

  /** Create a new internship listing (Company only) */
  @Post('/')
  @Security('bearerAuth')
  @SuccessResponse(201, 'Created')
  public async createInternship(
    @Request() req: ExpressRequest,
    @Body() body: InternshipBody,
  ): Promise<MessageResponse> {
    const company = await prisma.companyProfile.findUnique({ where: { userId: req.user!.id } })
    if (!company) { this.setStatus(404); return { success: false, message: 'Company profile not found' } }
    const result = await internshipService.createInternship(company.id, body as any)
    this.setStatus(201)
    return { success: true, message: 'Internship created', data: result }
  }

  /** Update an internship listing (Company only) */
  @Put('{id}')
  @Security('bearerAuth')
  public async updateInternship(
    @Path() id: string,
    @Request() req: ExpressRequest,
    @Body() body: Partial<InternshipBody>,
  ): Promise<MessageResponse> {
    const company = await prisma.companyProfile.findUnique({ where: { userId: req.user!.id } })
    if (!company) { this.setStatus(404); return { success: false, message: 'Company profile not found' } }
    const result = await internshipService.updateInternship(id, company.id, body as any)
    return { success: true, message: 'Internship updated', data: result }
  }

  /** Delete an internship listing (Company or Admin) */
  @Delete('{id}')
  @Security('bearerAuth')
  public async deleteInternship(
    @Path() id: string,
    @Request() req: ExpressRequest,
  ): Promise<MessageResponse> {
    const company = await prisma.companyProfile.findUnique({ where: { userId: req.user!.id } })
    if (!company) { this.setStatus(404); return { success: false, message: 'Company profile not found' } }
    await internshipService.deleteInternship(id, company.id)
    return { success: true, message: 'Internship deleted' }
  }

  /** Toggle bookmark on an internship (Student only) */
  @Post('{id}/bookmark')
  @Security('bearerAuth')
  public async toggleBookmark(
    @Path() id: string,
    @Request() req: ExpressRequest,
  ): Promise<MessageResponse> {
    const result = await internshipService.toggleBookmark(req.user!.id, id)
    return { success: true, message: 'Success', data: result }
  }

  /** Get current student's bookmarked internships */
  @Get('bookmarks/me')
  @Security('bearerAuth')
  public async getBookmarks(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const result = await internshipService.getBookmarks(req.user!.id)
    return { success: true, message: 'Success', data: result }
  }

  /** Get internships posted by the authenticated company */
  @Get('company/mine')
  @Security('bearerAuth')
  public async getMyInternships(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const company = await prisma.companyProfile.findUnique({ where: { userId: req.user!.id } })
    if (!company) { this.setStatus(404); return { success: false, message: 'Company profile not found' } }
    const result = await internshipService.getCompanyInternships(company.id)
    return { success: true, message: 'Success', data: result }
  }
}
