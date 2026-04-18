import { Request, Response, NextFunction } from 'express'
import * as evalService from '@/services/evaluation.service'
import { sendSuccess, sendCreated } from '@/utils/apiResponse'

export const submitEvaluation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await evalService.submitEvaluation(req.user!.id, req.body)
    sendCreated(res, result, 'Evaluation submitted')
  } catch (err) { next(err) }
}

export const getEvaluations = async (req: Request<{ enrollmentId: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await evalService.getEvaluationsForEnrollment(req.params.enrollmentId, req.user!.id)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const approveEvaluation = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await evalService.approveEvaluation(req.params.id, req.user!.id)
    sendSuccess(res, result, 'Evaluation approved')
  } catch (err) { next(err) }
}

export const submitSelfAssessment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await evalService.submitSelfAssessment(req.user!.id, req.body)
    sendCreated(res, result, 'Self-assessment submitted')
  } catch (err) { next(err) }
}

export const getMySelfAssessments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await evalService.getMySelfAssessments(req.user!.id)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}
