import { Request, Response, NextFunction } from 'express'
import { ApplicationStatus } from '@prisma/client'
import * as appService from '@/services/application.service'
import { sendSuccess, sendCreated } from '@/utils/apiResponse'

export const apply = async (req: Request<{ internshipId: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await appService.applyToInternship(req.user!.id, req.params.internshipId, {
      coverLetterText:  req.body.coverLetterText,
      coverLetterUrl:   (req.files as any)?.coverLetter?.[0]?.path,
      cvUrl:            (req.files as any)?.cv?.[0]?.path,
      additionalDocUrl: (req.files as any)?.additionalDoc?.[0]?.path,
    })
    sendCreated(res, result, 'Application submitted successfully')
  } catch (err) { next(err) }
}

export const getMyApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await appService.getMyApplications(req.user!.id)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const getApplicationsForInternship = async (req: Request<{ internshipId: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await appService.getApplicationsForInternship(req.params.internshipId, req.user!.id)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const updateStatus = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await appService.updateApplicationStatus(
      req.params.id,
      req.user!.id,
      req.body.status as ApplicationStatus,
      req.body.rejectionReason
    )
    sendSuccess(res, result, 'Application status updated')
  } catch (err) { next(err) }
}

export const scheduleInterview = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await appService.scheduleInterview(req.params.id, req.user!.id, {
      ...req.body,
      scheduledAt: new Date(req.body.scheduledAt),
    })
    sendSuccess(res, result, 'Interview scheduled')
  } catch (err) { next(err) }
}

export const withdraw = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    await appService.withdrawApplication(req.params.id, req.user!.id)
    sendSuccess(res, null, 'Application withdrawn')
  } catch (err) { next(err) }
}
