import { body, param, query } from 'express-validator'
import { Role, InternshipType, LogbookFrequency, EvaluationStage } from '@prisma/client'

// ── Shared ────────────────────────────────────────────────────

export const validateUuidParam = (name = 'id') =>
  param(name).isUUID().withMessage(`${name} must be a valid UUID`)

// ── Auth ──────────────────────────────────────────────────────

export const validateRegister = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  body('role')
    .isIn(Object.values(Role)).withMessage('Invalid role'),
  body('firstName')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 60 }).withMessage('First name too long'),
  body('lastName')
    .trim()
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 60 }).withMessage('Last name too long'),
  body('phone')
    .optional()
    .isMobilePhone('any').withMessage('Invalid phone number'),
]

export const validateLogin = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
]

export const validateForgotPassword = [
  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
]

export const validateResetPassword = [
  body('token')
    .notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
]

// ── Internship ────────────────────────────────────────────────

export const validateCreateInternship = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title must be 150 characters or fewer'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('type')
    .isIn(Object.values(InternshipType)).withMessage('Type must be ACADEMIC or PROFESSIONAL'),
  body('field')
    .trim()
    .notEmpty().withMessage('Field is required'),
  body('isRemote')
    .optional()
    .isBoolean().withMessage('isRemote must be true or false'),
  body('isPaid')
    .optional()
    .isBoolean().withMessage('isPaid must be true or false'),
  body('stipendAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Stipend amount must be a positive number'),
  body('durationWeeks')
    .optional()
    .isInt({ min: 1, max: 104 }).withMessage('Duration must be between 1 and 104 weeks'),
  body('slots')
    .optional()
    .isInt({ min: 1 }).withMessage('Slots must be at least 1'),
  body('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid ISO date'),
  body('endDate')
    .optional()
    .isISO8601().withMessage('End date must be a valid ISO date'),
  body('applicationDeadline')
    .optional()
    .isISO8601().withMessage('Deadline must be a valid ISO date'),
  body('latitude')
    .optional()
    .isFloat({ min: -90,  max: 90  }).withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
]

export const validateInternshipFilters = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type')
    .optional()
    .isIn(Object.values(InternshipType)).withMessage('Invalid internship type'),
]

// ── Application ───────────────────────────────────────────────

export const validateApplicationStatus = [
  body('status')
    .isIn(['REVIEWED', 'INTERVIEW_SCHEDULED', 'ACCEPTED', 'REJECTED'])
    .withMessage('Invalid application status'),
  body('rejectionReason')
    .if(body('status').equals('REJECTED'))
    .notEmpty().withMessage('Rejection reason is required when rejecting an application')
    .isLength({ max: 500 }).withMessage('Rejection reason must be 500 characters or fewer'),
]

export const validateScheduleInterview = [
  body('scheduledAt')
    .isISO8601().withMessage('Interview date must be a valid ISO datetime')
    .custom((val: string) => {
      if (new Date(val) <= new Date()) throw new Error('Interview must be scheduled in the future')
      return true
    }),
  body('durationMinutes')
    .optional()
    .isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes'),
  body('meetingLink')
    .optional()
    .isURL().withMessage('Meeting link must be a valid URL'),
]

// ── Logbook ───────────────────────────────────────────────────

export const validateLogbookEntry = [
  body('frequency')
    .isIn(Object.values(LogbookFrequency)).withMessage('Frequency must be DAILY or WEEKLY'),
  body('entryDate')
    .isISO8601().withMessage('Entry date must be a valid ISO date'),
  body('activitiesDone')
    .trim()
    .notEmpty().withMessage('Activities done is required')
    .isLength({ min: 20 }).withMessage('Please describe activities in at least 20 characters'),
  body('weekNumber')
    .optional()
    .isInt({ min: 1, max: 52 }).withMessage('Week number must be between 1 and 52'),
  body('skillsGained')
    .optional()
    .isLength({ max: 1000 }).withMessage('Skills gained must be 1000 characters or fewer'),
  body('challenges')
    .optional()
    .isLength({ max: 1000 }).withMessage('Challenges must be 1000 characters or fewer'),
  body('nextWeekPlan')
    .optional()
    .isLength({ max: 1000 }).withMessage('Next week plan must be 1000 characters or fewer'),
]

export const validateAttendance = [
  body('studentId')
    .isUUID().withMessage('studentId must be a valid UUID'),
  body('date')
    .isISO8601().withMessage('Date must be a valid ISO date'),
  body('status')
    .isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']).withMessage('Invalid attendance status'),
  body('hoursLogged')
    .optional()
    .isFloat({ min: 0, max: 24 }).withMessage('Hours logged must be between 0 and 24'),
]

// ── Evaluation ────────────────────────────────────────────────

const scoreField = (name: string) =>
  body(name)
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage(`${name} must be a score between 1 and 5`)

export const validateEvaluation = [
  body('enrollmentId')
    .isUUID().withMessage('enrollmentId must be a valid UUID'),
  body('stage')
    .isIn(Object.values(EvaluationStage)).withMessage('Stage must be MIDTERM or FINAL'),
  scoreField('punctuality'),
  scoreField('communication'),
  scoreField('technicalSkills'),
  scoreField('teamwork'),
  scoreField('initiative'),
  scoreField('professionalism'),
  body('strengths')
    .optional()
    .isLength({ max: 1000 }).withMessage('Strengths must be 1000 characters or fewer'),
  body('areasForImprovement')
    .optional()
    .isLength({ max: 1000 }).withMessage('Areas for improvement must be 1000 characters or fewer'),
  body('generalComments')
    .optional()
    .isLength({ max: 2000 }).withMessage('Comments must be 2000 characters or fewer'),
  body('recommendForHire')
    .optional()
    .isBoolean().withMessage('recommendForHire must be true or false'),
]

export const validateSelfAssessment = [
  body('stage')
    .isIn(Object.values(EvaluationStage)).withMessage('Stage must be MIDTERM or FINAL'),
  scoreField('skillsDeveloped'),
  scoreField('goalsMet'),
  scoreField('supervisorSupport'),
  scoreField('workEnvironment'),
  scoreField('overallExperience'),
  body('achievements')
    .optional()
    .isLength({ max: 1000 }).withMessage('Achievements must be 1000 characters or fewer'),
  body('challenges')
    .optional()
    .isLength({ max: 1000 }).withMessage('Challenges must be 1000 characters or fewer'),
  body('lessonsLearned')
    .optional()
    .isLength({ max: 1000 }).withMessage('Lessons learned must be 1000 characters or fewer'),
  body('futureGoals')
    .optional()
    .isLength({ max: 1000 }).withMessage('Future goals must be 1000 characters or fewer'),
]

// ── Messages ──────────────────────────────────────────────────

export const validateSendMessage = [
  body('content')
    .trim()
    .notEmpty().withMessage('Message content is required')
    .isLength({ max: 5000 }).withMessage('Message must be 5000 characters or fewer'),
]

export const validateStartConversation = [
  body('recipientId')
    .isUUID().withMessage('recipientId must be a valid UUID'),
]
