import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { authApi } from '@/api/endpoints'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ email: string }>()

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      await authApi.forgotPassword(email)
      toast.success('If that email exists, a reset link has been sent')
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">Forgot password</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your email and we will send a reset link.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input {...register('email')} type="email" className="input" />
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center">
            {isSubmitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/auth/login" className="text-brand-600 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
