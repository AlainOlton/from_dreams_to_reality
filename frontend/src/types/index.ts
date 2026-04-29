// ── Enums (mirror Prisma schema) ──────────────────────────────

export type Role =
  | 'STUDENT'
  | 'ACADEMIC_SUPERVISOR'
  | 'SITE_SUPERVISOR'
  | 'COMPANY'
  | 'ADMIN'

export type InternshipType   = 'ACADEMIC' | 'PROFESSIONAL'
export type InternshipStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'FILLED'

export type ApplicationStatus =
  | 'APPLIED'
  | 'REVIEWED'
  | 'INTERVIEW_SCHEDULED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN'

export type EvaluationStage  = 'MIDTERM' | 'FINAL'
export type EvaluationStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
export type LogbookFrequency = 'DAILY' | 'WEEKLY'
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'

// ── Auth ──────────────────────────────────────────────────────

export interface AuthUser {
  id:              string
  email:           string
  role:            Role
  isEmailVerified: boolean
  createdAt:       string
  studentProfile?:    { firstName: string; lastName: string; profilePhotoUrl: string | null }
  supervisorProfile?: { firstName: string; lastName: string; profilePhotoUrl: string | null }
  companyProfile?:    { companyName: string; logoUrl: string | null }
  adminProfile?:      { firstName: string; lastName: string }
}

export interface LoginPayload    { email: string; password: string }
export interface RegisterPayload {
  email: string; password: string; role: Role
  firstName: string; lastName: string; phone?: string
}

// ── Internship ────────────────────────────────────────────────

export interface Company {
  id:          string
  companyName: string
  logoUrl:     string | null
  city?:       string
  country?:    string
  website?:    string
  isVerified:  boolean
  description?: string
}

export interface Internship {
  id:                  string
  title:               string
  description:         string
  type:                InternshipType
  status:              InternshipStatus
  field:               string
  location?:           string
  city?:               string
  country?:            string
  latitude?:           number
  longitude?:          number
  isRemote:            boolean
  isPaid:              boolean
  stipendAmount?:      number
  currency?:           string
  durationWeeks?:      number
  startDate?:          string
  endDate?:            string
  applicationDeadline?: string
  slots?:              number
  requirements:        string[]
  responsibilities:    string[]
  skills:              string[]
  createdAt:           string
  company:             Company
  _count?:             { applications: number }
}

// ── Application ───────────────────────────────────────────────

export interface Application {
  id:              string
  internshipId:    string
  status:          ApplicationStatus
  coverLetterUrl?: string
  cvUrl?:          string
  appliedAt:       string
  reviewedAt?:     string
  rejectionReason?: string
  internship:      Internship
  interview?:      Interview
}

export interface Interview {
  id:               string
  applicationId:    string
  scheduledAt:      string
  durationMinutes?: number
  meetingLink?:     string
  location?:        string
  notes?:           string
  interviewerName?: string
}

// ── Enrollment ────────────────────────────────────────────────

export interface Enrollment {
  id:          string
  studentId:   string
  internshipId?: string
  type:        InternshipType
  companyName?: string
  startDate?:  string
  endDate?:    string
  isActive:    boolean
  student:     StudentProfile
  internship?: Internship
  supervisorAssignment?: SupervisorAssignment
}

export interface SupervisorAssignment {
  id:                   string
  enrollmentId:         string
  academicSupervisorId?: string
  siteSupervisorId?:    string
  academicSupervisor?:  { firstName: string; lastName: string; title?: string }
  siteSupervisor?:      { firstName: string; lastName: string }
}

// ── Profiles ──────────────────────────────────────────────────

export interface StudentProfile {
  id:              string
  userId:          string
  firstName:       string
  lastName:        string
  phone?:          string
  studentId?:      string
  department?:     string
  faculty?:        string
  yearOfStudy?:    number
  institution?:    string
  profilePhotoUrl?: string
  cvUrl?:          string
  applicationLetterUrl?: string
  bio?:            string
  skills:          string[]
}

export interface SupervisorProfile {
  id:              string
  userId:          string
  firstName:       string
  lastName:        string
  title?:          string
  department?:     string
  institution?:    string
  specialization?: string
  profilePhotoUrl?: string
}

// ── Logbook ───────────────────────────────────────────────────

export interface LogbookEntry {
  id:              string
  studentId:       string
  frequency:       LogbookFrequency
  entryDate:       string
  weekNumber?:     number
  activitiesDone:  string
  skillsGained?:   string
  challenges?:     string
  nextWeekPlan?:   string
  supervisorNote?: string
  isApproved:      boolean
  approvedAt?:     string
  attachmentUrl?:  string
  createdAt:       string
}

export interface AttendanceRecord {
  id:           string
  studentId:    string
  date:         string
  status:       AttendanceStatus
  checkInTime?: string
  checkOutTime?: string
  hoursLogged?: number
  note?:        string
}

export interface AttendanceSummary {
  total:            number
  present:          number
  absent:           number
  late:             number
  excused:          number
  totalHoursLogged: number
  records:          AttendanceRecord[]
}

// ── Evaluation ────────────────────────────────────────────────

export interface Evaluation {
  id:                   string
  enrollmentId:         string
  evaluatorId:          string
  stage:                EvaluationStage
  status:               EvaluationStatus
  punctuality?:         number
  communication?:       number
  technicalSkills?:     number
  teamwork?:            number
  initiative?:          number
  professionalism?:     number
  overallScore?:        number
  strengths?:           string
  areasForImprovement?: string
  generalComments?:     string
  recommendForHire?:    boolean
  submittedAt?:         string
  evaluator:            { firstName: string; lastName: string }
}

export interface SelfAssessment {
  id:                  string
  stage:               EvaluationStage
  skillsDeveloped?:    number
  goalsMet?:           number
  supervisorSupport?:  number
  workEnvironment?:    number
  overallExperience?:  number
  achievements?:       string
  challenges?:         string
  lessonsLearned?:     string
  futureGoals?:        string
  submittedAt?:        string
}

// ── Messaging ─────────────────────────────────────────────────

export interface Conversation {
  id:           string
  participants: ConversationParticipant[]
  messages:     Message[]
  updatedAt:    string
}

export interface ConversationParticipant {
  id:         string
  userId:     string
  lastReadAt?: string
}

export interface Message {
  id:             string
  conversationId: string
  senderId:       string
  content:        string
  attachmentUrl?: string
  sentAt:         string
  readAt?:        string
  sender:         { id: string; role: Role }
}

// ── Notifications ─────────────────────────────────────────────

export interface Notification {
  id:        string
  type:      string
  title:     string
  body:      string
  isRead:    boolean
  link?:     string
  createdAt: string
}

// ── API helpers ───────────────────────────────────────────────

export interface PaginatedResult<T> {
  data:       T[]
  total:      number
  page:       number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?:   T
}
