import { Router, Request, Response, NextFunction } from 'express'
import { Role } from '@prisma/client'
import { protect }   from '@/middleware/auth.middleware'
import { authorize } from '@/middleware/rbac.middleware'
import { prisma }    from '@/config/db'
import { sendSuccess } from '@/utils/apiResponse'

const router = Router()

// ── GET /university/dashboard — summary stats ────────────────
router.get('/dashboard',
  protect, authorize(Role.UNIVERSITY),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uniProfile = await prisma.universityProfile.findUnique({
        where: { userId: req.user!.id },
      })
      if (!uniProfile) {
        res.status(404).json({ success: false, message: 'University profile not found' })
        return
      }

      // Students whose institution matches this university
      const students = await prisma.studentProfile.findMany({
        where: { institution: uniProfile.universityName },
        select: {
          id: true, firstName: true, lastName: true,
          studentId: true, department: true, faculty: true,
          yearOfStudy: true, profilePhotoUrl: true,
          enrollments: {
            where: { isActive: true },
            include: {
              internship: { select: { title: true, company: { select: { companyName: true } } } },
              supervisorAssignment: {
                include: {
                  academicSupervisor: { select: { firstName: true, lastName: true } },
                },
              },
            },
          },
        },
      })

      const totalStudents    = students.length
      const activeInterns    = students.filter((s) => s.enrollments.length > 0).length
      const notYetPlaced     = totalStudents - activeInterns

      // Pending logbook entries for these students
      const studentIds = students.map((s) => s.id)
      const pendingLogs = await prisma.logbookEntry.count({
        where: { studentId: { in: studentIds }, isApproved: false },
      })

      // Evaluations submitted for these students
      const enrollmentIds = students.flatMap((s) => s.enrollments.map((e) => e.id))
      const evaluationsCount = await prisma.evaluation.count({
        where: { enrollmentId: { in: enrollmentIds } },
      })

      sendSuccess(res, {
        totalStudents,
        activeInterns,
        notYetPlaced,
        pendingLogs,
        evaluationsCount,
        students,
      })
    } catch (err) { next(err) }
  }
)

// ── GET /university/students — all students from this university ─
router.get('/students',
  protect, authorize(Role.UNIVERSITY),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uniProfile = await prisma.universityProfile.findUnique({
        where: { userId: req.user!.id },
      })
      if (!uniProfile) {
        res.status(404).json({ success: false, message: 'University profile not found' })
        return
      }

      const students = await prisma.studentProfile.findMany({
        where: { institution: uniProfile.universityName },
        include: {
          enrollments: {
            include: {
              internship: {
                select: {
                  title: true,
                  company: { select: { companyName: true, city: true } },
                },
              },
              supervisorAssignment: {
                include: {
                  academicSupervisor: { select: { firstName: true, lastName: true, title: true } },
                  siteSupervisor:     { select: { firstName: true, lastName: true } },
                },
              },
            },
          },
        },
        orderBy: { lastName: 'asc' },
      })

      sendSuccess(res, students)
    } catch (err) { next(err) }
  }
)

// ── GET /university/supervisors — academic supervisors from this university ─
router.get('/supervisors',
  protect, authorize(Role.UNIVERSITY),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uniProfile = await prisma.universityProfile.findUnique({
        where: { userId: req.user!.id },
      })
      if (!uniProfile) {
        res.status(404).json({ success: false, message: 'University profile not found' })
        return
      }

      const supervisors = await prisma.supervisorProfile.findMany({
        where: { institution: uniProfile.universityName },
        include: {
          academicAssignments: {
            include: {
              enrollment: {
                include: {
                  student: { select: { firstName: true, lastName: true, studentId: true } },
                },
              },
            },
          },
        },
        orderBy: { lastName: 'asc' },
      })

      sendSuccess(res, supervisors)
    } catch (err) { next(err) }
  }
)

// ── GET /university/evaluations — evaluations for university students ─
router.get('/evaluations',
  protect, authorize(Role.UNIVERSITY),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uniProfile = await prisma.universityProfile.findUnique({
        where: { userId: req.user!.id },
      })
      if (!uniProfile) {
        res.status(404).json({ success: false, message: 'University profile not found' })
        return
      }

      const students = await prisma.studentProfile.findMany({
        where:  { institution: uniProfile.universityName },
        select: { id: true },
      })
      const studentIds    = students.map((s) => s.id)
      const enrollmentIds = (await prisma.internshipEnrollment.findMany({
        where:  { studentId: { in: studentIds } },
        select: { id: true },
      })).map((e) => e.id)

      const evaluations = await prisma.evaluation.findMany({
        where:   { enrollmentId: { in: enrollmentIds } },
        include: {
          evaluator: { select: { firstName: true, lastName: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
      })

      sendSuccess(res, evaluations)
    } catch (err) { next(err) }
  }
)

// ── GET /university/reports — reports overview ───────────────
router.get('/reports',
  protect, authorize(Role.UNIVERSITY),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reports = await prisma.report.findMany({
        where:   { generatedById: req.user!.id },
        orderBy: { generatedAt: 'desc' },
      })
      sendSuccess(res, reports)
    } catch (err) { next(err) }
  }
)

export default router
