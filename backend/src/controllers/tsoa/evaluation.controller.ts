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
import * as evalService from '@/services/evaluation.service'
import type { MessageResponse } from './auth.controller'

// ── Models ────────────────────────────────────────────────────

export interface EvaluationBody {
  enrollmentId:          string
  /** MIDTERM | FINAL */
  stage:                 string
  /** 1–5 */
  punctuality?:          number
  /** 1–5 */
  communication?:        number
  /** 1–5 */
  technicalSkills?:      number
  /** 1–5 */
  teamwork?:             number
  /** 1–5 */
  initiative?:           number
  /** 1–5 */
  professionalism?:      number
  strengths?:            string
  areasForImprovement?:  string
  generalComments?:      string
  recommendForHire?:     boolean
}

export interface SelfAssessmentBody {
  enrollmentId?:       string
  /** MIDTERM | FINAL */
  stage:               string
  /** 1–5 */
  skillsDeveloped?:    number
  /** 1–5 */
  goalsMet?:           number
  /** 1–5 */
  supervisorSupport?:  number
  /** 1–5 */
  workEnvironment?:    number
  /** 1–5 */
  overallExperience?:  number
  achievements?:       string
  challenges?:         string
  lessonsLearned?:     string
  futureGoals?:        string
}

// ── Controller ────────────────────────────────────────────────

@Route('api/evaluations')
@Tags('Evaluations')
@Security('bearerAuth')
export class EvaluationController extends Controller {

  /**
   * Submit a supervisor evaluation for an enrolled student.
   * Requires ACADEMIC_SUPERVISOR or SITE_SUPERVISOR role.
   */
  @Post('/')
  @SuccessResponse(201, 'Created')
  public async submitEvaluation(
    @Request() req: ExpressRequest,
    @Body() body: EvaluationBody,
  ): Promise<MessageResponse> {
    const result = await evalService.submitEvaluation(req.user!.id, body as any)
    this.setStatus(201)
    return { success: true, message: 'Evaluation submitted', data: result }
  }

  /** Get all evaluations for a specific enrollment */
  @Get('enrollment/{enrollmentId}')
  public async getEvaluations(
    @Path() enrollmentId: string,
    @Request() req: ExpressRequest,
  ): Promise<MessageResponse> {
    const result = await evalService.getEvaluationsForEnrollment(enrollmentId, req.user!.id)
    return { success: true, message: 'Success', data: result }
  }

  /** Approve a submitted evaluation (Admin only) */
  @Patch('{id}/approve')
  public async approveEvaluation(
    @Path() id: string,
    @Request() req: ExpressRequest,
  ): Promise<MessageResponse> {
    const result = await evalService.approveEvaluation(id, req.user!.id)
    return { success: true, message: 'Evaluation approved', data: result }
  }

  /** Submit a student self-assessment (Student only) */
  @Post('self-assessment')
  @SuccessResponse(201, 'Created')
  public async submitSelfAssessment(
    @Request() req: ExpressRequest,
    @Body() body: SelfAssessmentBody,
  ): Promise<MessageResponse> {
    const result = await evalService.submitSelfAssessment(req.user!.id, body as any)
    this.setStatus(201)
    return { success: true, message: 'Self-assessment submitted', data: result }
  }

  /** Get all self-assessments for the authenticated student */
  @Get('self-assessment/me')
  public async getMySelfAssessments(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const result = await evalService.getMySelfAssessments(req.user!.id)
    return { success: true, message: 'Success', data: result }
  }
}
