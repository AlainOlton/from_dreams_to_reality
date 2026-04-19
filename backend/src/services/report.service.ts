import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import ExcelJS from 'exceljs'
import { ReportType } from '@prisma/client'
import { prisma } from '@/config/db'
import cloudinary from '@/config/cloudinary'

// ── Helpers ───────────────────────────────────────────────────

const uploadBuffer = async (
  buffer:   Buffer,
  filename: string,
  folder:   string,
  mimeType: 'application/pdf' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `internship-system/${folder}`, public_id: filename, resource_type: 'raw' },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error('Cloudinary upload failed'))
        resolve(result.secure_url)
      }
    )
    stream.end(buffer)
  })
}

const saveReport = async (
  generatedById: string,
  type:          ReportType,
  title:         string,
  fileUrl:       string,
  parameters?:   object
) =>
  prisma.report.create({
    data: { generatedById, type, title, fileUrl, parameters },
  })

// ── PDF helpers ───────────────────────────────────────────────

const addPdfHeader = async (
  page:     ReturnType<PDFDocument['addPage']>,
  pdfDoc:   PDFDocument,
  title:    string,
  subtitle: string
) => {
  const font      = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const bodyFont  = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const { width } = page.getSize()

  // Header bar
  page.drawRectangle({ x: 0, y: 780, width, height: 60, color: rgb(0.11, 0.62, 0.46) })
  page.drawText('Internship Monitoring System', { x: 30, y: 815, size: 11, font, color: rgb(1,1,1) })

  // Title
  page.drawText(title, { x: 30, y: 750, size: 18, font, color: rgb(0.1, 0.1, 0.1) })
  page.drawText(subtitle, {
    x: 30, y: 728, size: 10,
    font: bodyFont, color: rgb(0.4, 0.4, 0.4),
  })
  page.drawLine({
    start: { x: 30, y: 720 }, end: { x: width - 30, y: 720 },
    thickness: 0.5, color: rgb(0.8, 0.8, 0.8),
  })

  return bodyFont
}

const addPdfRow = (
  page:  ReturnType<PDFDocument['addPage']>,
  font:  any,
  label: string,
  value: string,
  y:     number,
  bold?: any
) => {
  page.drawText(label, { x: 30,  y, size: 10, font: bold ?? font, color: rgb(0.2, 0.2, 0.2) })
  page.drawText(value, { x: 220, y, size: 10, font,               color: rgb(0.3, 0.3, 0.3) })
}

// ── 1. Logbook Summary PDF ────────────────────────────────────

export const generateLogbookPdf = async (
  studentId:     string,
  generatedById: string
): Promise<string> => {
  const student = await prisma.studentProfile.findUnique({
    where:   { id: studentId },
    include: {
      logbookEntries:   { orderBy: { entryDate: 'asc' } },
      attendanceRecords:{ orderBy: { date: 'asc' } },
      user:             { select: { email: true } },
    },
  })
  if (!student) throw Object.assign(new Error('Student not found'), { statusCode: 404 })

  const pdfDoc = await PDFDocument.create()
  const page   = pdfDoc.addPage([595, 842]) // A4
  const bold   = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const font   = await addPdfHeader(
    page, pdfDoc,
    `Logbook Summary — ${student.firstName} ${student.lastName}`,
    `Generated on ${new Date().toLocaleDateString()} | ${student.user.email}`
  )

  let y = 700

  // Student details block
  const details: [string, string][] = [
    ['Student name',  `${student.firstName} ${student.lastName}`],
    ['Student ID',    student.studentId  ?? 'N/A'],
    ['Department',    student.department ?? 'N/A'],
    ['Institution',   student.institution ?? 'N/A'],
    ['Total entries', String(student.logbookEntries.length)],
    ['Total hours',   String(student.attendanceRecords.reduce((a, r) => a + (r.hoursLogged ?? 0), 0))],
  ]
  for (const [label, value] of details) {
    addPdfRow(page, font, label, value, y, bold)
    y -= 18
  }

  y -= 16
  page.drawText('Logbook entries', { x: 30, y, size: 12, font: bold, color: rgb(0.11, 0.62, 0.46) })
  y -= 20

  for (const entry of student.logbookEntries.slice(0, 25)) {
    if (y < 80) break // prevent overflow; a real implementation would add pages

    const dateStr = new Date(entry.entryDate).toLocaleDateString()
    page.drawText(`${dateStr}  |  Week ${entry.weekNumber ?? '—'}  |  ${entry.frequency}`, {
      x: 30, y, size: 9, font: bold, color: rgb(0.2, 0.2, 0.2),
    })
    y -= 14

    const activity = entry.activitiesDone.substring(0, 120) + (entry.activitiesDone.length > 120 ? '…' : '')
    page.drawText(activity, { x: 30, y, size: 9, font, color: rgb(0.35, 0.35, 0.35) })
    y -= 10

    page.drawLine({
      start: { x: 30, y }, end: { x: 565, y },
      thickness: 0.3, color: rgb(0.88, 0.88, 0.88),
    })
    y -= 14
  }

  const pdfBytes = await pdfDoc.save()
  const buffer   = Buffer.from(pdfBytes)
  const fileUrl  = await uploadBuffer(buffer, `logbook-${studentId}-${Date.now()}`, 'reports', 'application/pdf')

  await saveReport(
    generatedById, ReportType.LOGBOOK_SUMMARY,
    `Logbook — ${student.firstName} ${student.lastName}`,
    fileUrl, { studentId }
  )

  return fileUrl
}

// ── 2. Evaluation Report PDF ──────────────────────────────────

export const generateEvaluationPdf = async (
  enrollmentId:  string,
  generatedById: string
): Promise<string> => {
  const enrollment = await prisma.internshipEnrollment.findUnique({
    where:   { id: enrollmentId },
    include: {
      student:     { include: { user: { select: { email: true } } } },
      internship:  { include: { company: { select: { companyName: true } } } },
      supervisorAssignment: {
        include: {
          academicSupervisor: { select: { firstName: true, lastName: true, title: true } },
          siteSupervisor:     { select: { firstName: true, lastName: true } },
        },
      },
    },
  })
  if (!enrollment) throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 })

  const evaluations = await prisma.evaluation.findMany({
    where:   { enrollmentId },
    include: { evaluator: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: 'asc' },
  })

  const selfAssessments = await prisma.selfAssessment.findMany({
    where:   { enrollmentId },
    orderBy: { createdAt: 'asc' },
  })

  const pdfDoc = await PDFDocument.create()
  const page   = pdfDoc.addPage([595, 842])
  const bold   = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const font   = await addPdfHeader(
    page, pdfDoc,
    `Evaluation Report — ${enrollment.student.firstName} ${enrollment.student.lastName}`,
    `Enrollment ID: ${enrollmentId} | Generated: ${new Date().toLocaleDateString()}`
  )

  let y = 700

  const infoRows: [string, string][] = [
    ['Student',      `${enrollment.student.firstName} ${enrollment.student.lastName}`],
    ['Company',      enrollment.internship?.company?.companyName ?? enrollment.companyName ?? 'N/A'],
    ['Type',         enrollment.type],
    ['Start date',   enrollment.startDate ? new Date(enrollment.startDate).toLocaleDateString() : 'N/A'],
    ['End date',     enrollment.endDate   ? new Date(enrollment.endDate).toLocaleDateString()   : 'N/A'],
    ['Academic sup.', enrollment.supervisorAssignment?.academicSupervisor
      ? `${enrollment.supervisorAssignment.academicSupervisor.firstName} ${enrollment.supervisorAssignment.academicSupervisor.lastName}`
      : 'Not assigned'],
    ['Site sup.',     enrollment.supervisorAssignment?.siteSupervisor
      ? `${enrollment.supervisorAssignment.siteSupervisor.firstName} ${enrollment.supervisorAssignment.siteSupervisor.lastName}`
      : 'Not assigned'],
  ]

  for (const [label, value] of infoRows) {
    addPdfRow(page, font, label, value, y, bold)
    y -= 18
  }

  // Evaluations
  for (const ev of evaluations) {
    if (y < 120) break
    y -= 16
    page.drawText(`${ev.stage} Evaluation — ${ev.evaluator.firstName} ${ev.evaluator.lastName}`, {
      x: 30, y, size: 11, font: bold, color: rgb(0.11, 0.62, 0.46),
    })
    y -= 16

    const scores: [string, string][] = [
      ['Punctuality',     ev.punctuality     != null ? `${ev.punctuality}/5`     : 'N/A'],
      ['Communication',   ev.communication   != null ? `${ev.communication}/5`   : 'N/A'],
      ['Technical skills',ev.technicalSkills != null ? `${ev.technicalSkills}/5` : 'N/A'],
      ['Teamwork',        ev.teamwork        != null ? `${ev.teamwork}/5`        : 'N/A'],
      ['Initiative',      ev.initiative      != null ? `${ev.initiative}/5`      : 'N/A'],
      ['Professionalism', ev.professionalism != null ? `${ev.professionalism}/5` : 'N/A'],
      ['Overall score',   ev.overallScore    != null ? `${ev.overallScore}/5`    : 'N/A'],
      ['Recommend hire',  ev.recommendForHire != null ? (ev.recommendForHire ? 'Yes' : 'No') : 'N/A'],
    ]

    for (const [label, value] of scores) {
      addPdfRow(page, font, label, value, y, bold)
      y -= 15
    }

    if (ev.strengths) {
      page.drawText(`Strengths: ${ev.strengths.substring(0, 200)}`, {
        x: 30, y, size: 9, font, color: rgb(0.3, 0.3, 0.3),
      })
      y -= 14
    }
    if (ev.generalComments) {
      page.drawText(`Comments: ${ev.generalComments.substring(0, 200)}`, {
        x: 30, y, size: 9, font, color: rgb(0.3, 0.3, 0.3),
      })
      y -= 14
    }
  }

  // Self-assessments
  for (const sa of selfAssessments) {
    if (y < 120) break
    y -= 16
    page.drawText(`Student Self-Assessment — ${sa.stage}`, {
      x: 30, y, size: 11, font: bold, color: rgb(0.32, 0.29, 0.72),
    })
    y -= 16

    const saScores: [string, string][] = [
      ['Skills developed',   sa.skillsDeveloped   != null ? `${sa.skillsDeveloped}/5`   : 'N/A'],
      ['Goals met',          sa.goalsMet          != null ? `${sa.goalsMet}/5`          : 'N/A'],
      ['Supervisor support', sa.supervisorSupport != null ? `${sa.supervisorSupport}/5` : 'N/A'],
      ['Work environment',   sa.workEnvironment   != null ? `${sa.workEnvironment}/5`   : 'N/A'],
      ['Overall experience', sa.overallExperience != null ? `${sa.overallExperience}/5` : 'N/A'],
    ]

    for (const [label, value] of saScores) {
      addPdfRow(page, font, label, value, y, bold)
      y -= 15
    }
  }

  const pdfBytes = await pdfDoc.save()
  const buffer   = Buffer.from(pdfBytes)
  const fileUrl  = await uploadBuffer(buffer, `evaluation-${enrollmentId}-${Date.now()}`, 'reports', 'application/pdf')

  await saveReport(
    generatedById, ReportType.EVALUATION_REPORT,
    `Evaluation — ${enrollment.student.firstName} ${enrollment.student.lastName}`,
    fileUrl, { enrollmentId }
  )

  return fileUrl
}

// ── 3. Completion Certificate PDF ────────────────────────────

export const generateCertificate = async (
  enrollmentId:  string,
  generatedById: string
): Promise<string> => {
  const enrollment = await prisma.internshipEnrollment.findUnique({
    where:   { id: enrollmentId },
    include: {
      student:    true,
      internship: { include: { company: { select: { companyName: true } } } },
    },
  })
  if (!enrollment) throw Object.assign(new Error('Enrollment not found'), { statusCode: 404 })

  const pdfDoc = await PDFDocument.create()
  const page   = pdfDoc.addPage([842, 595]) // A4 landscape
  const bold   = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const font   = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const { width, height } = page.getSize()

  // Border
  page.drawRectangle({ x: 20, y: 20, width: width-40, height: height-40,
    borderColor: rgb(0.11, 0.62, 0.46), borderWidth: 3, color: rgb(1,1,1) })
  page.drawRectangle({ x: 28, y: 28, width: width-56, height: height-56,
    borderColor: rgb(0.11, 0.62, 0.46), borderWidth: 0.5, color: rgb(1,1,1) })

  // Title
  page.drawText('CERTIFICATE OF COMPLETION', {
    x: width/2 - 220, y: height - 100,
    size: 28, font: bold, color: rgb(0.11, 0.62, 0.46),
  })

  page.drawText('This is to certify that', {
    x: width/2 - 80, y: height - 160,
    size: 14, font, color: rgb(0.3, 0.3, 0.3),
  })

  page.drawText(`${enrollment.student.firstName} ${enrollment.student.lastName}`, {
    x: width/2 - 160, y: height - 210,
    size: 32, font: bold, color: rgb(0.1, 0.1, 0.1),
  })

  page.drawLine({
    start: { x: 120, y: height - 220 }, end: { x: width - 120, y: height - 220 },
    thickness: 0.5, color: rgb(0.7, 0.7, 0.7),
  })

  const companyName = enrollment.internship?.company?.companyName ?? enrollment.companyName ?? 'the company'
  const startDate   = enrollment.startDate ? new Date(enrollment.startDate).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : ''
  const endDate     = enrollment.endDate   ? new Date(enrollment.endDate).toLocaleDateString('en-GB',   { day:'numeric', month:'long', year:'numeric' }) : ''

  page.drawText(`has successfully completed an internship at`, {
    x: width/2 - 170, y: height - 265, size: 14, font, color: rgb(0.3,0.3,0.3),
  })
  page.drawText(companyName, {
    x: width/2 - (companyName.length * 8), y: height - 295,
    size: 20, font: bold, color: rgb(0.1,0.1,0.1),
  })
  if (startDate && endDate) {
    page.drawText(`from ${startDate} to ${endDate}`, {
      x: width/2 - 130, y: height - 330,
      size: 12, font, color: rgb(0.4,0.4,0.4),
    })
  }

  page.drawText(`Issued on ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}`, {
    x: width/2 - 90, y: 80, size: 11, font, color: rgb(0.5,0.5,0.5),
  })

  const pdfBytes = await pdfDoc.save()
  const buffer   = Buffer.from(pdfBytes)
  const fileUrl  = await uploadBuffer(
    buffer, `certificate-${enrollmentId}-${Date.now()}`, 'reports', 'application/pdf'
  )

  await saveReport(
    generatedById, ReportType.COMPLETION_CERTIFICATE,
    `Certificate — ${enrollment.student.firstName} ${enrollment.student.lastName}`,
    fileUrl, { enrollmentId }
  )

  return fileUrl
}

// ── 4. Institutional Analytics Excel ─────────────────────────

export const generateInstitutionalExcel = async (
  generatedById: string,
  filters?: { department?: string; year?: number }
): Promise<string> => {
  const workbook  = new ExcelJS.Workbook()
  workbook.creator = 'Internship Monitoring System'
  workbook.created  = new Date()

  // ── Sheet 1: Placement summary ──
  const summarySheet = workbook.addWorksheet('Placement Summary')
  summarySheet.columns = [
    { header: 'Metric',  key: 'metric',  width: 35 },
    { header: 'Value',   key: 'value',   width: 20 },
  ]
  summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D9E75' } }

  const [
    totalStudents, totalEnrollments, academicEnrollments,
    professionalEnrollments, totalEvaluations, completedEvaluations,
  ] = await Promise.all([
    prisma.studentProfile.count(),
    prisma.internshipEnrollment.count(),
    prisma.internshipEnrollment.count({ where: { type: 'ACADEMIC' } }),
    prisma.internshipEnrollment.count({ where: { type: 'PROFESSIONAL' } }),
    prisma.evaluation.count(),
    prisma.evaluation.count({ where: { status: 'APPROVED' } }),
  ])

  const summaryRows = [
    { metric: 'Total registered students',          value: totalStudents },
    { metric: 'Total internship enrollments',        value: totalEnrollments },
    { metric: 'Academic internships',                value: academicEnrollments },
    { metric: 'Professional internships',            value: professionalEnrollments },
    { metric: 'Total evaluations submitted',         value: totalEvaluations },
    { metric: 'Approved evaluations',                value: completedEvaluations },
    { metric: 'Report generated',                    value: new Date().toLocaleDateString() },
  ]
  summaryRows.forEach(row => summarySheet.addRow(row))

  // ── Sheet 2: Student list ──
  const studentSheet = workbook.addWorksheet('Students')
  studentSheet.columns = [
    { header: 'First name',   key: 'firstName',   width: 18 },
    { header: 'Last name',    key: 'lastName',    width: 18 },
    { header: 'Student ID',   key: 'studentId',   width: 16 },
    { header: 'Department',   key: 'department',  width: 22 },
    { header: 'Institution',  key: 'institution', width: 24 },
    { header: 'Year of study',key: 'yearOfStudy', width: 14 },
    { header: 'Email',        key: 'email',       width: 30 },
  ]
  studentSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  studentSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF534AB7' } }

  const students = await prisma.studentProfile.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { lastName: 'asc' },
  })
  students.forEach(s => studentSheet.addRow({
    firstName:   s.firstName,
    lastName:    s.lastName,
    studentId:   s.studentId  ?? '',
    department:  s.department ?? '',
    institution: s.institution ?? '',
    yearOfStudy: s.yearOfStudy ?? '',
    email:       s.user.email,
  }))

  // ── Sheet 3: Enrollments ──
  const enrollmentSheet = workbook.addWorksheet('Enrollments')
  enrollmentSheet.columns = [
    { header: 'Student',      key: 'student',    width: 24 },
    { header: 'Type',         key: 'type',       width: 16 },
    { header: 'Company',      key: 'company',    width: 28 },
    { header: 'Start date',   key: 'startDate',  width: 14 },
    { header: 'End date',     key: 'endDate',    width: 14 },
    { header: 'Active',       key: 'isActive',   width: 10 },
  ]
  enrollmentSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  enrollmentSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD85A30' } }

  const enrollments = await prisma.internshipEnrollment.findMany({
    include: {
      student:    { select: { firstName: true, lastName: true } },
      internship: { include: { company: { select: { companyName: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
  enrollments.forEach(e => enrollmentSheet.addRow({
    student:   `${e.student.firstName} ${e.student.lastName}`,
    type:      e.type,
    company:   e.internship?.company?.companyName ?? e.companyName ?? 'N/A',
    startDate: e.startDate ? new Date(e.startDate).toLocaleDateString() : '',
    endDate:   e.endDate   ? new Date(e.endDate).toLocaleDateString()   : '',
    isActive:  e.isActive ? 'Yes' : 'No',
  }))

  // Write to buffer and upload
  const buffer  = Buffer.from(await workbook.xlsx.writeBuffer())
  const fileUrl = await uploadBuffer(
    buffer,
    `institutional-report-${Date.now()}`,
    'reports',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )

  await saveReport(
    generatedById, ReportType.INSTITUTIONAL_REPORT,
    `Institutional Report — ${new Date().toLocaleDateString()}`,
    fileUrl, filters ?? {}
  )

  return fileUrl
}

// ── 5. Placement Analytics (JSON — for dashboard charts) ─────

export const getPlacementAnalytics = async () => {
  const [
    byType,
    byField,
    applicationsByStatus,
    evaluationScores,
    monthlyEnrollments,
  ] = await Promise.all([
    // Enrollments by internship type
    prisma.internshipEnrollment.groupBy({
      by:     ['type'],
      _count: { id: true },
    }),

    // Top internship fields
    prisma.internship.groupBy({
      by:     ['field'],
      _count: { id: true },
      orderBy:{ _count: { id: 'desc' } },
      take:   10,
    }),

    // Applications by status
    prisma.application.groupBy({
      by:     ['status'],
      _count: { id: true },
    }),

    // Average evaluation scores
    prisma.evaluation.aggregate({
      _avg: {
        punctuality:     true,
        communication:   true,
        technicalSkills: true,
        teamwork:        true,
        initiative:      true,
        professionalism: true,
        overallScore:    true,
      },
      where: { status: 'APPROVED' },
    }),

    // Enrollments per month (last 12 months)
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT
        TO_CHAR("createdAt", 'YYYY-MM') AS month,
        COUNT(*)::bigint                AS count
      FROM internship_enrollments
      WHERE "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month ASC
    `,
  ])

  return {
    byType:              byType.map(r  => ({ type: r.type,     count: r._count.id })),
    byField:             byField.map(r => ({ field: r.field,   count: r._count.id })),
    applicationsByStatus:applicationsByStatus.map(r => ({ status: r.status, count: r._count.id })),
    averageScores:       evaluationScores._avg,
    monthlyEnrollments:  monthlyEnrollments.map(r => ({
      month: r.month,
      count: Number(r.count),
    })),
  }
}
