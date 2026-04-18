import { EvaluationStage, EvaluationStatus } from '@prisma/client'
import { prisma } from '@/config/db'

interface EvaluationBody {
  enrollmentId:        string
  stage:               EvaluationStage
  punctuality?:        number
  communication?:      number
  technicalSkills?:    number
  teamwork?:           number
  initiative?:         number
  professionalism?:    number
  strengths?:          string
  areasForImprovement?: string
  generalComments?:    string
  recommendForHire?:   boolean
}

const calcOverallScore = (body: EvaluationBody): number | null => {
  const fields = [
    body.punctuality, body.communication, body.technicalSkills,
    body.teamwork, body.initiative, body.professionalism,
  ].filter((v): v is number => v !== undefined)

  if (fields.length === 0) return null
  return parseFloat((fields.reduce((a, b) => a + b, 0) / fields.length).toFixed(2))
}

export const submitEvaluation = async (supervisorUserId: string, body: EvaluationBody) => {
  const supervisor = await prisma.supervisorProfile.findUnique({ where: { userId: supervisorUserId } })
  if (!supervisor) throw Object.assign(new Error('Supervisor profile not found'), { statusCode: 404 })

  const overallScore = calcOverallScore(body)

  return prisma.evaluation.upsert({
    where:  { enrollmentId_evaluatorId_stage: { enrollmentId: body.enrollmentId, evaluatorId: supervisor.id, stage: body.stage } },
    create: { ...body, evaluatorId: supervisor.id, overallScore, status: EvaluationStatus.SUBMITTED, submittedAt: new Date() },
    update: { ...body, overallScore, status: EvaluationStatus.SUBMITTED, submittedAt: new Date() },
  })
}

export const getEvaluationsForEnrollment = async (enrollmentId: string, userId: string) => {
  // Allow student, their assigned supervisors, or admin
  return prisma.evaluation.findMany({
    where:   { enrollmentId },
    orderBy: { createdAt: 'desc' },
    include: {
      evaluator: { select: { firstName: true, lastName: true, title: true } },
    },
  })
}

export const approveEvaluation = async (evaluationId: string, adminUserId: string) => {
  return prisma.evaluation.update({
    where: { id: evaluationId },
    data:  { status: EvaluationStatus.APPROVED, approvedAt: new Date(), approvedById: adminUserId },
  })
}

export const submitSelfAssessment = async (
  studentUserId: string,
  body: {
    enrollmentId?:      string
    stage:              EvaluationStage
    skillsDeveloped?:   number
    goalsMet?:          number
    supervisorSupport?: number
    workEnvironment?:   number
    overallExperience?: number
    achievements?:      string
    challenges?:        string
    lessonsLearned?:    string
    futureGoals?:       string
  }
) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })

  return prisma.selfAssessment.upsert({
    where:  { studentId_enrollmentId_stage: { studentId: student.id, enrollmentId: body.enrollmentId ?? '', stage: body.stage } },
    create: { ...body, studentId: student.id, submittedAt: new Date() },
    update: { ...body, submittedAt: new Date() },
  })
}

export const getMySelfAssessments = async (studentUserId: string) => {
  const student = await prisma.studentProfile.findUnique({ where: { userId: studentUserId } })
  if (!student) throw Object.assign(new Error('Student profile not found'), { statusCode: 404 })
  return prisma.selfAssessment.findMany({ where: { studentId: student.id }, orderBy: { createdAt: 'desc' } })
}
