import { LogbookFrequency } from '@prisma/client'
import { prisma } from '@/config/db'
import { getPagination, buildPaginatedResult } from '@/utils/pagination'
import { PaginationQuery } from '@/types/common.types'

interface LogbookEntryBody {
  frequency:      LogbookFrequency
  entryDate:      Date
  weekNumber?:    number
  activitiesDone: string
  skillsGained?:  string
  challenges?:    string
  nextWeekPlan?:  string
  attachmentUrl?: string
  enrollmentId?:  string
}

export const createEntry = async (studentUserId: string, body: LogbookEntryBody) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

  return prisma.logbookEntry.create({
    data: { ...body, studentId: student.id, entryDate: new Date(body.entryDate) },
  })
}

export const getMyEntries = async (studentUserId: string, query: PaginationQuery) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

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

export const getStudentEntries = async (
  studentId:       string,
  supervisorUserId: string,
  query:           PaginationQuery
) => {
  // Verify this supervisor is assigned to this student
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

export const approveEntry = async (entryId: string, supervisorUserId: string, note?: string) => {
  const supervisor = await prisma.supervisorProfile.findUnique({ where: { userId: supervisorUserId } })
  if (!supervisor) throw Object.assign(new Error('Supervisor not found'), { statusCode: 404 })

  return prisma.logbookEntry.update({
    where: { id: entryId },
    data:  {
      isApproved:    true,
      approvedAt:    new Date(),
      approvedById:  supervisor.id,
      supervisorNote: note ?? null,
    },
  })
}

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

export const getAttendanceSummary = async (studentUserId: string) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

  const records = await prisma.attendanceRecord.findMany({
    where:   { studentId: student.id },
    orderBy: { date: 'desc' },
  })

  const summary = {
    total:   records.length,
    present: records.filter(r => r.status === 'PRESENT').length,
    absent:  records.filter(r => r.status === 'ABSENT').length,
    late:    records.filter(r => r.status === 'LATE').length,
    excused: records.filter(r => r.status === 'EXCUSED').length,
    totalHoursLogged: records.reduce((acc, r) => acc + (r.hoursLogged ?? 0), 0),
    records,
  }

  return summary
}

export const logAttendance = async (
  supervisorUserId: string,
  data: {
    studentId:    string
    date:         Date
    status:       'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
    checkInTime?: Date
    checkOutTime?: Date
    hoursLogged?: number
    note?:        string
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
