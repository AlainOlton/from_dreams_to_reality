import { ApplicationStatus } from '@prisma/client'
import { prisma } from '@/config/db'
import { sendApplicationStatusEmail } from '@/services/email.service'
import { sendApplicationSMS } from '@/services/sms.service'

export const applyToInternship = async (
  studentUserId: string,
  internshipId:  string,
  body: {
    coverLetterText?: string
    coverLetterUrl?:  string
    cvUrl?:           string
    additionalDocUrl?: string
  }
) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

  const internship = await prisma.internship.findUnique({ where: { id: internshipId } })
  if (!internship) throw Object.assign(new Error('Internship not found'), { statusCode: 404 })
  if (internship.status !== 'OPEN') throw Object.assign(new Error('This internship is no longer accepting applications'), { statusCode: 400 })

  const existing = await prisma.application.findUnique({
    where: { internshipId_studentId: { internshipId, studentId: student.id } },
  })
  if (existing) throw Object.assign(new Error('You have already applied to this internship'), { statusCode: 409 })

  return prisma.application.create({
    data: { internshipId, studentId: student.id, ...body },
    include: { internship: { select: { title: true } } },
  })
}

export const getMyApplications = async (studentUserId: string) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

  return prisma.application.findMany({
    where:   { studentId: student.id },
    orderBy: { appliedAt: 'desc' },
    include: {
      internship: {
        include: { company: { select: { companyName: true, logoUrl: true, city: true } } },
      },
      interview: true,
    },
  })
}

export const getApplicationsForInternship = async (
  internshipId: string,
  companyUserId: string
) => {
  const company = await prisma.companyProfile.findUnique({ where: { userId: companyUserId } })
  if (!company) throw Object.assign(new Error('Company profile not found'), { statusCode: 404 })

  const internship = await prisma.internship.findUnique({ where: { id: internshipId } })
  if (!internship || internship.companyId !== company.id)
    throw Object.assign(new Error('Forbidden'), { statusCode: 403 })

  return prisma.application.findMany({
    where:   { internshipId },
    orderBy: { appliedAt: 'desc' },
    include: {
      student: {
        select: {
          firstName: true, lastName: true,
          cvUrl: true, profilePhotoUrl: true,
          skills: true, institution: true, department: true,
        },
      },
      interview: true,
    },
  })
}

export const updateApplicationStatus = async (
  applicationId:  string,
  companyUserId:  string,
  status:         ApplicationStatus,
  rejectionReason?: string
) => {
  const application = await prisma.application.findUnique({
    where:   { id: applicationId },
    include: {
      internship: { include: { company: true } },
      student:    { include: { user: true } },
    },
  })
  if (!application) throw Object.assign(new Error('Application not found'), { statusCode: 404 })

  const company = await prisma.companyProfile.findUnique({ where: { userId: companyUserId } })
  if (!company || application.internship.companyId !== company.id)
    throw Object.assign(new Error('Forbidden'), { statusCode: 403 })

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data:  {
      status,
      rejectionReason: rejectionReason ?? null,
      reviewedAt:      new Date(),
    },
  })

  // Fire off email + SMS notifications
  const studentEmail = application.student.user.email
  const firstName    = application.student.firstName
  const companyName  = application.internship.company.companyName

  await sendApplicationStatusEmail(studentEmail, firstName, companyName, status)
  if (application.student.phone) {
    await sendApplicationSMS(application.student.phone, companyName, status)
  }

  // Notify via socket if user is connected
  return updated
}

export const scheduleInterview = async (
  applicationId: string,
  companyUserId:  string,
  data: {
    scheduledAt:     Date
    durationMinutes?: number
    meetingLink?:    string
    location?:       string
    notes?:          string
    interviewerName?: string
  }
) => {
  const application = await prisma.application.findUnique({
    where:   { id: applicationId },
    include: { internship: true },
  })
  if (!application) throw Object.assign(new Error('Application not found'), { statusCode: 404 })

  const company = await prisma.companyProfile.findUnique({ where: { userId: companyUserId } })
  if (!company || application.internship.companyId !== company.id)
    throw Object.assign(new Error('Forbidden'), { statusCode: 403 })

  const [interview] = await prisma.$transaction([
    prisma.interview.upsert({
      where:  { applicationId },
      create: { applicationId, ...data },
      update: { ...data },
    }),
    prisma.application.update({
      where: { id: applicationId },
      data:  { status: ApplicationStatus.INTERVIEW_SCHEDULED },
    }),
  ])

  return interview
}

export const withdrawApplication = async (applicationId: string, studentUserId: string) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

  const application = await prisma.application.findUnique({ where: { id: applicationId } })
  if (!application || application.studentId !== student.id)
    throw Object.assign(new Error('Forbidden'), { statusCode: 403 })

  return prisma.application.update({
    where: { id: applicationId },
    data:  { status: ApplicationStatus.WITHDRAWN },
  })
}
