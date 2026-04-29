import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authApi } from '@/api/endpoints'
import Spinner from '@/components/common/Spinner'
import { CheckCircle, XCircle } from 'lucide-react'

export default function VerifyEmail() {
  const [params]  = useSearchParams()
  const [status, setStatus] = useState<'loading'|'success'|'error'>('loading')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); return }
    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="card p-10 text-center max-w-sm w-full">
        {status === 'loading' && <Spinner size="lg" className="mx-auto mb-4" />}
        {status === 'success' && <>
          <CheckCircle size={48} className="text-brand-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Email verified!</h2>
          <Link to="/auth/login" className="btn-primary">Go to login</Link>
        </>}
        {status === 'error' && <>
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Verification failed</h2>
          <p className="text-sm text-gray-500 mb-4">Link may be expired or invalid.</p>
          <Link to="/auth/login" className="btn-secondary">Back to login</Link>
        </>}
      </div>
    </div>
  )
}
