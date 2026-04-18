import { Request, Response, NextFunction } from 'express'
import * as internshipService from '@/services/internship.service'
import { sendSuccess, sendCreated } from '@/utils/apiResponse'
import { prisma } from '@/config/db'

export const listInternships = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await internshipService.listInternships(req.query as any)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const getInternship = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await internshipService.getInternshipById(req.params.id)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const createInternship = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const company = await prisma.companyProfile.findUnique({ where: { userId: req.user!.id } })
    if (!company) { res.status(404).json({ success: false, message: 'Company profile not found' }); return }
    const result = await internshipService.createInternship(company.id, req.body)
    sendCreated(res, result, 'Internship created')
  } catch (err) { next(err) }
}

export const updateInternship = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const company = await prisma.companyProfile.findUnique({ where: { userId: req.user!.id } })
    if (!company) { res.status(404).json({ success: false, message: 'Company profile not found' }); return }
    const result = await internshipService.updateInternship(req.params.id, company.id, req.body)
    sendSuccess(res, result, 'Internship updated')
  } catch (err) { next(err) }
}

export const deleteInternship = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const company = await prisma.companyProfile.findUnique({ where: { userId: req.user!.id } })
    if (!company) { res.status(404).json({ success: false, message: 'Company profile not found' }); return }
    await internshipService.deleteInternship(req.params.id, company.id)
    sendSuccess(res, null, 'Internship deleted')
  } catch (err) { next(err) }
}

export const toggleBookmark = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await internshipService.toggleBookmark(req.user!.id, req.params.id)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const getBookmarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await internshipService.getBookmarks(req.user!.id)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}

export const getMyInternships = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const company = await prisma.companyProfile.findUnique({ where: { userId: req.user!.id } })
    if (!company) { res.status(404).json({ success: false, message: 'Company profile not found' }); return }
    const result = await internshipService.getCompanyInternships(company.id)
    sendSuccess(res, result)
  } catch (err) { next(err) }
}
