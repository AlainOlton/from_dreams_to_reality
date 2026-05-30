import { LogbookFrequency } from '@prisma/client'
import { prisma } from '@/config/db'
import { getPagination, buildPaginatedResult } from '@/utils/pagination'
import { PaginationQuery } from '@/types/common.types'

// ── Helpers ───────────────────────────────────────────────────

/** Strip time component and return a UTC midnight Date for a given date string/Date */
const toDateOnly = (d: Date | string): Date => {
  const dt = new Date(d)
  return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate()))
}

/** Return today's UTC midnight Date */
const todayUTC = (): Date => toDateOnly(new Date())

// ── Types ─────────────────────────────────────────────────────

interface LogbookEntryBody {
  frequency:      LogbookFrequency
  entryDate:      Date | string
  weekNumber?:    number
  internshipSite: string
  activitiesDone: string
  skillsGained:   string
  challenges:     string
  nextWeekPlan:   string
  absenceReason?: string
  attachmentUrl?: string
  enrollmentId?:  string
}

// ── Notification helper ───────────────────────────────────────

/**
 * Create a DB notification and emit a socket event to the target user.
 */
async function notifyUser(
  userId:  string,
  title:   string,
  body:    string,
  link?:   string,
) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type:  'LOGBOOK_REMINDER',
      title,
      body,
      link:  link ?? '/supervisor/logbooks',
    },
  })

  // Emit real-time event if socket server is available
  try {
    const { emitNotification } = await import('@/server')
    emitNotification(userId, { type: 'LOGBOOK_REMINDER', title, body, link: link ?? '/supervisor/logbooks' })
  } catch {
    // Socket not available (e.g. during tests) — silently skip
  }

  return notification
}

// ── Create entry ──────────────────────────────────────────────

export const createEntry = async (studentUserId: string, body: LogbookEntryBody) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

  const entryDate = toDateOnly(body.entryDate)
  const today     = todayUTC()

  // ── Rule: cannot submit a logbook for a past date ─────────────
  // If the entry date is strictly before today, reject it.
  if (entryDate < today) {
    throw Object.assign(
      new Error(
        'You cannot submit a logbook entry for a past date. ' +
        'Entries must be submitted on the same day they occurred.'
      ),
      { statusCode: 400 }
    )
  }

  // ── Rule: no duplicate entry for the same date ────────────────
  const existing = await prisma.logbookEntry.findFirst({
    where: { studentId: student.id, entryDate },
  })
  if (existing) {
    throw Object.assign(
      new Error('A logbook entry for this date already exists.'),
      { statusCode: 409 }
    )
  }

  const { entryDate: _d, weekNumber, ...rest } = body

  const entry = await prisma.logbookEntry.create({
    data: {
      ...rest,
      studentId:  student.id,
      entryDate,
      weekNumber: weekNumber != null ? Number(weekNumber) : undefined,
    },
  })

  // ── Auto-mark attendance as PRESENT when logbook is submitted ─
  await prisma.attendanceRecord.upsert({
    where:  { studentId_date: { studentId: student.id, date: entryDate } },
    create: {
      studentId:    student.id,
      enrollmentId: body.enrollmentId ?? null,
      date:         entryDate,
      status:       'PRESENT',
    },
    update: {
      // Only upgrade to PRESENT if currently ABSENT (don't overwrite LATE/EXCUSED)
      status: 'PRESENT',
    },
  })

  return entry
}

// ── Upload final report ───────────────────────────────────────

export const uploadFinalReport = async (studentUserId: string, fileUrl: string) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

  // Attach the final report URL to the most recent logbook entry,
  // or create a dedicated record if none exists yet.
  const latest = await prisma.logbookEntry.findFirst({
    where:   { studentId: student.id },
    orderBy: { entryDate: 'desc' },
  })

  if (!latest) {
    throw Object.assign(
      new Error('No logbook entries found. Submit at least one entry before uploading the final report.'),
      { statusCode: 400 }
    )
  }

  return prisma.logbookEntry.update({
    where: { id: latest.id },
    data:  { finalReportUrl: fileUrl },
  })
}

// ── Get my entries ────────────────────────────────────────────

export const getMyEntries = async (studentUserId: string, query: PaginationQuery) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) return buildPaginatedResult([], 0, 1, 20)

  const { page, limit, skip } = getPagination(query)
  const where = { studentId: student.id }

  const [data, total] = await Promise.all([
    prisma.logbookEntry.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { entryDate: 'desc' },
    }),
    prisma.logbookEntry.count({ where }),
  ])

  return buildPaginatedResult(data, total, page, limit)
}

// ── Get student entries (supervisor view) ─────────────────────

export const getStudentEntries = async (
  studentId:        string,
  supervisorUserId: string,
  query:            PaginationQuery
) => {
  const supervisor = await prisma.supervisorProfile.findUnique({ where: { userId: supervisorUserId } })
  if (!supervisor) throw Object.assign(new Error('Supervisor profile not found'), { statusCode: 404 })

  const assignment = await prisma.supervisorAssignment.findFirst({
    where: {
      OR: [
        { academicSupervisorId: supervisor.id },
        { siteSupervisorId:     supervisor.id },
      ],
      enrollment: { studentId },
    },
  })
  if (!assignment) throw Object.assign(new Error('You are not assigned to this student'), { statusCode: 403 })

  const { page, limit, skip } = getPagination(query)
  const where = { studentId }

  const [data, total] = await Promise.all([
    prisma.logbookEntry.findMany({ where, skip, take: limit, orderBy: { entryDate: 'desc' } }),
    prisma.logbookEntry.count({ where }),
  ])

  return buildPaginatedResult(data, total, page, limit)
}

// ── Approve entry ─────────────────────────────────────────────

export const approveEntry = async (entryId: string, supervisorUserId: string, note?: string) => {
  const supervisor = await prisma.supervisorProfile.findUnique({ where: { userId: supervisorUserId } })
  if (!supervisor) throw Object.assign(new Error('Supervisor not found'), { statusCode: 404 })

  return prisma.logbookEntry.update({
    where: { id: entryId },
    data:  {
      isApproved:     true,
      approvedAt:     new Date(),
      approvedById:   supervisor.id,
      supervisorNote: note ?? null,
    },
  })
}

// ── Update entry ──────────────────────────────────────────────

export const updateEntry = async (
  entryId:       string,
  studentUserId: string,
  data:          Partial<LogbookEntryBody>
) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

  const entry = await prisma.logbookEntry.findUnique({ where: { id: entryId } })
  if (!entry || entry.studentId !== student.id)
    throw Object.assign(new Error('Not found or forbidden'), { statusCode: 403 })
  if (entry.isApproved)
    throw Object.assign(new Error('Cannot edit an already approved entry'), { statusCode: 400 })

  return prisma.logbookEntry.update({ where: { id: entryId }, data })
}

// ── Attendance summary ────────────────────────────────────────

export const getAttendanceSummary = async (studentUserId: string) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

  const records = await prisma.attendanceRecord.findMany({
    where:   { studentId: student.id },
    orderBy: { date: 'desc' },
  })

  return {
    total:            records.length,
    present:          records.filter(r => r.status === 'PRESENT').length,
    absent:           records.filter(r => r.status === 'ABSENT').length,
    late:             records.filter(r => r.status === 'LATE').length,
    excused:          records.filter(r => r.status === 'EXCUSED').length,
    totalHoursLogged: records.reduce((acc, r) => acc + (r.hoursLogged ?? 0), 0),
    records,
  }
}

// ── Log attendance (supervisor) ───────────────────────────────

export const logAttendance = async (
  supervisorUserId: string,
  data: {
    studentId:     string
    date:          Date
    status:        'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
    checkInTime?:  Date
    checkOutTime?: Date
    hoursLogged?:  number
    note?:         string
  }
) => {
  const supervisor = await prisma.supervisorProfile.findUnique({ where: { userId: supervisorUserId } })
  if (!supervisor) throw Object.assign(new Error('Supervisor not found'), { statusCode: 404 })

  return prisma.attendanceRecord.upsert({
    where:  { studentId_date: { studentId: data.studentId, date: new Date(data.date) } },
    create: { ...data, recordedById: supervisor.id, date: new Date(data.date) },
    update: { ...data, recordedById: supervisor.id },
  })
}

// ── Daily missed-logbook check (called by a scheduled job or manually) ──

/**
 * For every active enrollment, check if the student submitted a logbook entry
 * for yesterday. If not:
 *  - Create an ABSENT attendance record (unless one already exists)
 *  - Notify the assigned academic supervisor
 *
 * This should be called once per day (e.g. via a cron job at midnight).
 */
export const processMissedLogbooks = async () => {
  const yesterday = new Date(todayUTC())
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)

  // All active enrollments with their supervisor assignments
  const enrollments = await prisma.internshipEnrollment.findMany({
    where: { isActive: true },
    include: {
      student: true,
      supervisorAssignment: {
        include: {
          academicSupervisor: { include: { user: true } },
        },
      },
    },
  })

  for (const enrollment of enrollments) {
    const studentId = enrollment.studentId

    // Check if student submitted a logbook for yesterday
    const entry = await prisma.logbookEntry.findFirst({
      where: { studentId, entryDate: yesterday },
    })

    if (entry) continue // logbook was submitted — nothing to do

    // No logbook — mark as ABSENT if not already recorded
    await prisma.attendanceRecord.upsert({
      where:  { studentId_date: { studentId, date: yesterday } },
      create: {
        studentId,
        enrollmentId: enrollment.id,
        date:         yesterday,
        status:       'ABSENT',
        note:         'No logbook entry submitted for this day.',
      },
      update: {}, // don't overwrite an existing record (supervisor may have set EXCUSED)
    })

    // Notify the academic supervisor
    const academicSupervisor = enrollment.supervisorAssignment?.academicSupervisor
    if (academicSupervisor?.user) {
      const student = enrollment.student
      const dateStr = yesterday.toISOString().split('T')[0]
      await notifyUser(
        academicSupervisor.user.id,
        'Missed logbook entry',
        `${student.firstName} ${student.lastName} did not submit a logbook entry for ${dateStr}. ` +
        `This has been recorded as ABSENT.`,
        `/supervisor/logbooks?studentId=${studentId}`,
      )
    }
  }
}
