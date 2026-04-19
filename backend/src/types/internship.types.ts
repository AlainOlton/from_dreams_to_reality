import { InternshipType, InternshipStatus } from '@prisma/client'

export interface CreateInternshipBody {
  title:               string
  description:         string
  type:                InternshipType
  field:               string
  location?:           string
  city?:               string
  country?:            string
  latitude?:           number
  longitude?:          number
  isRemote?:           boolean
  isPaid?:             boolean
  stipendAmount?:      number
  currency?:           string
  durationWeeks?:      number
  startDate?:          string
  endDate?:            string
  applicationDeadline?: string
  slots?:              number
  requirements?:       string[]
  responsibilities?:   string[]
  skills?:             string[]
}

export interface UpdateInternshipBody extends Partial<CreateInternshipBody> {
  status?: InternshipStatus
}

export interface InternshipFilterQuery {
  page?:     string
  limit?:    string
  search?:   string
  field?:    string
  city?:     string
  country?:  string
  isRemote?: string
  isPaid?:   string
  type?:     InternshipType
  status?:   InternshipStatus
}

export interface EnrollmentBody {
  studentId:    string
  internshipId?: string
  type:          InternshipType
  companyName?:  string
  startDate?:    string
  endDate?:      string
}

export interface AssignSupervisorBody {
  enrollmentId:          string
  academicSupervisorId?: string
  siteSupervisorId?:     string
}
