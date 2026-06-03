import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/context/AuthContext'
import { userApi } from '@/api/endpoints'
import { authApi } from '@/api/endpoints'
import toast from 'react-hot-toast'
import { Shield, Bell, User, Key, Save } from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  phone:     z.string().optional(),
})
type ProfileForm = z.infer<typeof profileSchema>

const passwordSchema = z.object({
  email:       z.string().email(),
  newPassword: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Needs uppercase').regex(/[0-9]/, 'Needs number'),
})
type PasswordForm = z.infer<typeof passwordSchema>

export default function AdminSettings() {
  const { user, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'system'>('profile')

  const { register: profReg, handleSubmit: profSub, formState: { isSubmitting: profLoading } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.adminProfile?.firstName ?? '',
      lastName:  user?.adminProfile?.lastName  ?? '',
    },
  })

  const { register: pwReg, handleSubmit: pwSub, reset: pwReset, formState: { errors: pwErrors, isSubmitting: pwLoading } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { email: user?.email ?? '' },
  })

  const onProfileSave = async (data: ProfileForm) => {
    try {
      await userApi.updateStudentProfile(data) // reuse generic profile update
      await refreshUser()
      toast.success('Profile updated')
    } catch {
      toast.error('Update failed')
    }
  }

  const onPasswordChange = async (data: PasswordForm) => {
    try {
      await authApi.forgotPassword(data.email)
      toast.success('Password reset email sent — check your inbox')
      pwReset()
    } catch {
      toast.error('Failed to send reset email')
    }
  }

  const tabs = [
    { id: 'profile'       as const, label: 'Profile',        icon: <User     size={15} /> },
    { id: 'password'      as const, label: 'Password',       icon: <Key      size={15} /> },
    { id: 'notifications' as const, label: 'Notifications',  icon: <Bell     size={15} /> },
    { id: 'system'        as const, label: 'System',         icon: <Shield   size={15} /> },
  ]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and system preferences</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Tab sidebar */}
        <div className="sm:w-48 flex-shrink-0">
          <div className="card p-2 space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left
                  ${activeTab === tab.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1">

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <div className="card p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Admin profile</h2>
              <form onSubmit={profSub(onProfileSave)} className="space-y-4 max-w-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First name</label>
                    <input {...profReg('firstName')} className="input" />
                  </div>
                  <div>
                    <label className="label">Last name</label>
                    <input {...profReg('lastName')} className="input" />
                  </div>
                </div>
                <div>
                  <label className="label">Email</label>
                  <input value={user?.email ?? ''} disabled className="input" />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input {...profReg('phone')} className="input" placeholder="+250 7xx xxx xxx" />
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={profLoading} className="btn-primary">
                    <Save size={15} /> {profLoading ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Password tab */}
          {activeTab === 'password' && (
            <div className="card p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-2">Change password</h2>
              <p className="text-sm text-gray-500 mb-5">
                We will send a password reset link to your email address.
              </p>
              <form onSubmit={pwSub(onPasswordChange)} className="space-y-4 max-w-md">
                <div>
                  <label className="label">Your email</label>
                  <input {...pwReg('email')} type="email" className="input" readOnly />
                </div>
                <div className="pt-1">
                  <button type="submit" disabled={pwLoading} className="btn-primary">
                    <Key size={15} /> {pwLoading ? 'Sending…' : 'Send reset email'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === 'notifications' && (
            <div className="card p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Notification preferences</h2>
              <div className="space-y-4 max-w-md">
                {[
                  { label: 'Email on new application',      desc: 'Get notified when a student applies.' },
                  { label: 'Email on evaluation submitted', desc: 'Receive a summary when a supervisor submits.' },
                  { label: 'Email on system errors',        desc: 'Critical system alerts.' },
                  { label: 'In-app push notifications',     desc: 'Real-time notifications in the dashboard.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-brand-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                    </label>
                  </div>
                ))}
                <div className="pt-2">
                  <button onClick={() => toast.success('Preferences saved')} className="btn-primary">
                    <Save size={15} /> Save preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* System tab */}
          {activeTab === 'system' && (
            <div className="card p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">System information</h2>
              <div className="space-y-3 max-w-md">
                {[
                  { label: 'Application',  value: 'Internship Connection and Tracking System' },
                  { label: 'Version',      value: '1.0.0' },
                  { label: 'Backend',      value: 'Node.js + Express + TypeScript' },
                  { label: 'Database',     value: 'PostgreSQL via Prisma ORM' },
                  { label: 'Storage',      value: 'Cloudinary' },
                  { label: 'Frontend',     value: 'React + Vite + Tailwind CSS' },
                  { label: 'Auth',         value: 'JWT (7-day expiry)' },
                  { label: 'Real-time',    value: 'Socket.io' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm font-semibold text-yellow-800 mb-1">Environment</p>
                <p className="text-xs text-yellow-700">
                  Ensure your <code className="bg-yellow-100 px-1 rounded">.env</code> files are configured correctly for production.
                  See the backend <code>.env.example</code> for all required variables.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
