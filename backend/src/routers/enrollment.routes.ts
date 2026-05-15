import { Router, Request, Response, NextFunction } from 'express'
import { Role }      from '@prisma/client'
import { protect }   from '@/middleware/auth.middleware'
import { authorize } from '@/middleware/rbac.middleware'
import { prisma }    from '@/config/db'
import { sendSuccess, sendCreated } from '@/utils/apiResponse'

const router = Router()

// ── Shared include shape ──────────────────────────────────────
const enrollmentInclude = {
  student: {
    select: {
      id: true, firstName: true, lastName: true,
      studentId: true, department: true, institution: true,
      profilePhotoUrl: true,
    },
  },
  internship: {
    select: {
      title: true,
      company: { select: { companyName: true } },
    },
  },
  supervisorAssignment: {
    include: {
      academicSupervisor: { select: { firstName: true, lastName: true, title: true } },
      siteSupervisor:     { select: { firstName: true, lastName: true } },
    },
  },
} as const

// ── GET /enrollments  (Admin — all enrollments) ───────────────
router.get('/',
  protect, authorize(Role.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const enrollments = await prisma.internshipEnrollment.findMany({
        orderBy: { createdAt: 'desc' },
        include: enrollmentInclude,
      })
      sendSuccess(res, enrollments)
    } catch (err) { next(err) }
  }
)

// ── GET /enrollments/mine  (Supervisor — their assigned students) ─
router.get('/mine',
  protect, authorize(Role.ACADEMIC_SUPERVISOR, Role.SITE_SUPERVISOR),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const supervisor = await prisma.supervisorProfile.findUnique({
        where: { userId: req.user!.id },
      })
      if (!supervisor) {
        res.status(404).json({ success: false, message: 'Supervisor profile not found' })
        return
      }

      const enrollments = await prisma.internshipEnrollment.findMany({
        where: {
          supervisorAssignment: {
            OR: [
              { academicSupervisorId: supervisor.id },
              { siteSupervisorId:     supervisor.id },
            ],
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          ...enrollmentInclude,
          // Extra counts for supervisor dashboard badges
          _count: false,
        },
      })

      sendSuccess(res, enrollments)
    } catch (err) { next(err) }
  }
)

// ── GET /enrollments/company  (Company — their active interns) ──
router.get('/company',
  protect, authorize(Role.COMPANY),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const company = await prisma.companyProfile.findUnique({
        where: { userId: req.user!.id },
      })
      if (!company) {
        res.status(404).json({ success: false, message: 'Company profile not found' })
        return
      }

      const enrollments = await prisma.internshipEnrollment.findMany({
        where: {
          internship: { companyId: company.id },
        },
        orderBy: { createdAt: 'desc' },
        include: enrollmentInclude,
      })

      sendSuccess(res, enrollments)
    } catch (err) { next(err) }
  }
)

// ── GET /enrollments/student/me  (Student — their own enrollment) ─
router.get('/student/me',
  protect, authorize(Role.STUDENT),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const student = await prisma.studentProfile.findUnique({
        where: { userId: req.user!.id },
      })
      if (!student) {
        sendSuccess(res, [])
        return
      }

      const enrollments = await prisma.internshipEnrollment.findMany({
        where:   { studentId: student.id },
        orderBy: { createdAt: 'desc' },
        include: enrollmentInclude,
      })

      sendSuccess(res, enrollments)
    } catch (err) { next(err) }
  }
)

// ── POST /enrollments  (Admin — enroll a student) ────────────
router.post('/',
  protect, authorize(Role.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId, type, internshipId, companyName, startDate, endDate } = req.body

      if (!studentId || !type) {
        res.status(400).json({ success: false, message: 'studentId and type are required' })
        return
      }

      const enrollment = await prisma.internshipEnrollment.create({
        data: {
          studentId,
          type,
          internshipId:  internshipId  || null,
          companyName:   companyName   || null,
          startDate:     startDate     ? new Date(startDate) : null,
          endDate:       endDate       ? new Date(endDate)   : null,
          isActive:      true,
        },
        include: enrollmentInclude,
      })

      sendCreated(res, enrollment, 'Student enrolled successfully')
    } catch (err) { next(err) }
  }
)

// ── POST /enrollments/assign-supervisors  (Admin) ────────────
router.post('/assign-supervisors',
  protect, authorize(Role.ADMIN),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { enrollmentId, academicSupervisorId, siteSupervisorId } = req.body

      if (!enrollmentId) {
        res.status(400).json({ success: false, message: 'enrollmentId is required' })
        return
      }

      const assignment = await prisma.supervisorAssignment.upsert({
        where:  { enrollmentId },
        create: { enrollmentId, academicSupervisorId: academicSupervisorId || null, siteSupervisorId: siteSupervisorId || null },
        update: {
          ...(academicSupervisorId !== undefined && { academicSupervisorId: academicSupervisorId || null }),
          ...(siteSupervisorId     !== undefined && { siteSupervisorId:     siteSupervisorId     || null }),
        },
      })

      sendSuccess(res, assignment, 'Supervisors assigned successfully')
    } catch (err) { next(err) }
  }
)

// ── PATCH /enrollments/:id  (Admin — update enrollment) ──────
router.patch('/:id',
  protect, authorize(Role.ADMIN),
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate, isActive, companyName } = req.body
      const enrollment = await prisma.internshipEnrollment.update({
        where: { id: req.params.id },
        data:  {
          ...(startDate   !== undefined && { startDate:   startDate   ? new Date(startDate)  : null }),
          ...(endDate     !== undefined && { endDate:     endDate     ? new Date(endDate)    : null }),
          ...(isActive    !== undefined && { isActive }),
          ...(companyName !== undefined && { companyName }),
        },
        include: enrollmentInclude,
      })
      sendSuccess(res, enrollment, 'Enrollment updated')
    } catch (err) { next(err) }
  }
)

export default router
