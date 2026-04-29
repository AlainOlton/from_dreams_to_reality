import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import type { Role } from '@/types'

const ROLES: { value: Role; label: string }[] = [
  { value: 'STUDENT',             label: 'Student / Intern' },
  { value: 'ACADEMIC_SUPERVISOR', label: 'Academic Supervisor' },
  { value: 'SITE_SUPERVISOR',     label: 'Site Supervisor' },
  { value: 'COMPANY',             label: 'Company / Employer' },
]

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  email:     z.string().email('Valid email required'),
  password:  z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Needs uppercase').regex(/[0-9]/, 'Needs number'),
  role:      z.enum(['STUDENT','ACADEMIC_SUPERVISOR','SITE_SUPERVISOR','COMPANY','ADMIN'] as const),
})
type Form = z.infer<typeof schema>

export default function Register() {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'STUDENT' },
  })

  const onSubmit = async (data: Form) => {
    try {
      await authRegister(data)
      toast.success('Account created! Please verify your email.')
      navigate('/')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create account</h1>
        <p className="text-sm text-gray-500 mb-6">Join the Internship Monitoring System</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First name</label>
              <input {...register('firstName')} className="input" />
              {errors.firstName && <p className="form-error">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="label">Last name</label>
              <input {...register('lastName')} className="input" />
              {errors.lastName && <p className="form-error">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <label className="label">Role</label>
            <select {...register('role')} className="input">
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input" />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Password</label>
            <input {...register('password')} type="password" className="input" />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-2.5">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
