import { Role } from '@prisma/client'

export interface JwtPayload {
  id:    string
  email: string
  role:  Role
}

export interface RegisterBody {
  email:     string
  password:  string
  role:      Role
  firstName: string
  lastName:  string
  phone?:    string
}

export interface LoginBody {
  email:    string
  password: string
}
