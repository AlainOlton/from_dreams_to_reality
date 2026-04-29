import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '@/api/endpoints'
import toast from 'react-hot-toast'

export default function ResetPassword() {
  const [params]  = useSearchParams()
  const navigate  = useNavigate()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ password: string }>()

  const onSubmit = async ({ password }: { password: string }) => {
    const token = params.get('token') ?? ''
    try {
      await authApi.resetPassword(token, password)
      toast.success('Password reset! Please log in.')
      navigate('/auth/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Reset failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">Reset password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">New password</label>
            <input {...register('password')} type="password" className="input" />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
            {isSubmitting ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  )
}
