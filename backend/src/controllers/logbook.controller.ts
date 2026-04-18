import { Request, Response, NextFunction } from 'express'
import * as logbookService from '@/services/logbook.service'
import { sendSuccess, sendCreated } from '@/utils/apiResponse'

export const createEntry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const attachmentUrl = (req.file as any)?.path
    const result = await logbookService.createEntry(req.user!.id, { ...req.body, attachmentUrl })
    sendCreated(res, result, 'Logbook entry created')
  } catch (err) { next(err) }
}

export const getMyEntries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await logbookService.getMyEntries(req.user!.id, req.query as any)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const getStudentEntries = async (req: Request<{ studentId: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await logbookService.getStudentEntries(req.params.studentId, req.user!.id, req.query as any)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const approveEntry = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await logbookService.approveEntry(req.params.id, req.user!.id, req.body.note)
    sendSuccess(res, result, 'Entry approved')
  } catch (err) { next(err) }
}

export const updateEntry = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await logbookService.updateEntry(req.params.id, req.user!.id, req.body)
    sendSuccess(res, result, 'Entry updated')
  } catch (err) { next(err) }
}

export const getAttendanceSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await logbookService.getAttendanceSummary(req.user!.id)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const logAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await logbookService.logAttendance(req.user!.id, {
      ...req.body,
      date: new Date(req.body.date),
    })
    sendSuccess(res, result, 'Attendance logged')
  } catch (err) { next(err) }
}
