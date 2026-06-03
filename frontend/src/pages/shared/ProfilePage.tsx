import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { userApi, universityApi } from '@/api/endpoints'
import Spinner from '@/components/common/Spinner'
import toast   from 'react-hot-toast'
import {
  User, Mail, Phone, Building2, GraduationCap,
  Briefcase, Globe, MapPin, Camera, Upload,
  CheckCircle, X, Plus, Save,
} from 'lucide-react'

// ─── Shared style helpers ─────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 13px',
  borderRadius: 9, border: '1.5px solid rgba(13,202,240,0.25)',
  background: '#fff', fontSize: '0.875rem', color: '#0d1a26',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.78rem',
  fontWeight: 600, color: '#5a8fa3', marginBottom: 5,
}
const sectionCard: React.CSSProperties = {
  background: '#fff', borderRadius: 14,
  border: '1px solid rgba(13,202,240,0.15)',
  boxShadow: '0 2px 12px rgba(13,202,240,0.06)',
  padding: '24px',
  marginBottom: 20,
}
const sectionTitle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  fontSize: '0.85rem', fontWeight: 700, color: '#0d1a26',
  textTransform: 'uppercase', letterSpacing: '0.06em',
  marginBottom: 20,
}
const saveBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '9px 20px', borderRadius: 9, border: 'none',
  background: 'linear-gradient(135deg, #0dcaf0, #0aa8cc)',
  color: '#fff', fontSize: '0.875rem', fontWeight: 700,
  cursor: 'pointer', fontFamily: 'inherit',
  boxShadow: '0 3px 12px rgba(13,202,240,0.3)',
}

// ─── Role banner color ────────────────────────────────────────
const ROLE_LABEL: Record<string, string> = {
  STUDENT:             'Student',
  ACADEMIC_SUPERVISOR: 'Academic Supervisor',
  SITE_SUPERVISOR:     'Site Supervisor',
  COMPANY:             'Organization',
  ADMIN:               'Administrator',
  UNIVERSITY:          'University',
}

// ─── Avatar upload helper ─────────────────────────────────────
function AvatarUpload({
  current, onUpload, uploading,
}: { current: string | null; onUpload: (f: File) => void; uploading: boolean }) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative' }}>
        {current ? (
          <img src={current} alt="Profile" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(13,202,240,0.4)' }} />
        ) : (
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(13,202,240,0.12)', border: '3px solid rgba(13,202,240,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={34} style={{ color: '#0aa8cc' }} />
          </div>
        )}
        <button
          type="button" onClick={() => ref.current?.click()}
          style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#0dcaf0', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <Camera size={13} color="#fff" />
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f) }} />
      <button type="button" onClick={() => ref.current?.click()} style={{ ...saveBtn, padding: '7px 16px', fontSize: '0.8rem', background: uploading ? '#7dddf5' : 'linear-gradient(135deg,#0dcaf0,#0aa8cc)' }} disabled={uploading}>
        {uploading ? 'Uploading…' : <><Camera size={13} /> Choose Photo</>}
      </button>
      <p style={{ fontSize: '0.72rem', color: '#9bbfcc' }}>JPG, PNG. Max 5MB.</p>
    </div>
  )
}

// ─── Skills manager ───────────────────────────────────────────
function SkillsManager({ skills, onChange }: { skills: string[]; onChange: (s: string[]) => void }) {
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !skills.includes(v)) { onChange([...skills, v]); setInput('') }
  }
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder="e.g. Python, Django, Excel…"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button type="button" onClick={add} style={{ ...saveBtn, padding: '9px 16px', flexShrink: 0 }}>
          <Plus size={14} /> Add
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills.map((s) => (
          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px 4px 12px', borderRadius: 20, background: 'rgba(13,202,240,0.1)', border: '1px solid rgba(13,202,240,0.25)', fontSize: '0.8rem', color: '#0aa8cc', fontWeight: 600 }}>
            {s}
            <button type="button" onClick={() => onChange(skills.filter(sk => sk !== s))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0aa8cc', display: 'flex', padding: 0 }}>
              <X size={12} />
            </button>
          </span>
        ))}
        {skills.length === 0 && <p style={{ fontSize: '0.82rem', color: '#9bbfcc' }}>No skills added yet.</p>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// STUDENT PROFILE
// ─────────────────────────────────────────────────────────────
function StudentProfile({ user }: { user: any }) {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['student-profile'], queryFn: userApi.getStudentProfile })
  const p = data?.data?.data ?? {}

  const [form, setForm] = useState<any>(null)
  if (!form && p.firstName) setTimeout(() => setForm({ ...p }), 0)
  const f = form ?? p

  const updateMutation = useMutation({
    mutationFn: (d: any) => userApi.updateStudentProfile(d),
    onSuccess: () => { toast.success('Profile saved!'); qc.invalidateQueries({ queryKey: ['student-profile'] }) },
    onError:   () => toast.error('Failed to save profile'),
  })
  const photoMutation = useMutation({
    mutationFn: (fd: FormData) => userApi.uploadPhoto(fd),
    onSuccess: () => { toast.success('Photo updated!'); qc.invalidateQueries({ queryKey: ['student-profile'] }); qc.invalidateQueries({ queryKey: ['me'] }) },
    onError:   () => toast.error('Photo upload failed'),
  })
  const cvMutation = useMutation({
    mutationFn: (fd: FormData) => userApi.uploadCv(fd),
    onSuccess: () => { toast.success('CV uploaded!'); qc.invalidateQueries({ queryKey: ['student-profile'] }) },
    onError:   () => toast.error('CV upload failed'),
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const set = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }} className="profile-grid">
      {/* LEFT */}
      <div>
        {/* Personal info */}
        <div style={sectionCard}>
          <div style={sectionTitle}><User size={15} style={{ color: '#0dcaf0' }} /> Personal Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={labelStyle}>First Name</label><input value={f.firstName ?? ''} onChange={(e) => set('firstName', e.target.value)} placeholder="John" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div><label style={labelStyle}>Last Name</label><input value={f.lastName ?? ''} onChange={(e) => set('lastName', e.target.value)} placeholder="Doe" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div><label style={labelStyle}>Email</label><input value={user?.email ?? ''} disabled style={{ ...inputStyle, background: '#f4fbfd', color: '#9bbfcc' }} /></div>
            <div><label style={labelStyle}>Phone Number</label><input value={f.phone ?? ''} onChange={(e) => set('phone', e.target.value)} placeholder="+260 700 000 000" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div><label style={labelStyle}>Registration Number</label><input value={f.studentId ?? ''} onChange={(e) => set('studentId', e.target.value)} placeholder="e.g. STU/2024/001" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div>
              <label style={labelStyle}>Year of Study</label>
              <select value={f.yearOfStudy ?? ''} onChange={(e) => set('yearOfStudy', e.target.value ? Number(e.target.value) : null)} style={{ ...inputStyle, background: '#fff' }}>
                <option value="">Select year</option>
                {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div><label style={labelStyle}>University</label><input value={f.institution ?? ''} onChange={(e) => set('institution', e.target.value)} placeholder="e.g. University of Rwanda" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div><label style={labelStyle}>Department</label><input value={f.department ?? ''} onChange={(e) => set('department', e.target.value)} placeholder="e.g. Computer Science" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Bio</label>
            <textarea value={f.bio ?? ''} onChange={(e) => set('bio', e.target.value)} rows={3} placeholder="Tell us a little about yourself…" style={{ ...inputStyle, resize: 'none' }} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} />
          </div>
          <button style={{ ...saveBtn, marginTop: 16 }} onClick={() => updateMutation.mutate(f)} disabled={updateMutation.isPending}>
            <Save size={14} /> {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {/* Skills */}
        <div style={sectionCard}>
          <div style={sectionTitle}><CheckCircle size={15} style={{ color: '#0dcaf0' }} /> Skills</div>
          <p style={{ fontSize: '0.82rem', color: '#9bbfcc', marginBottom: 14 }}>Add skills that represent your abilities and expertise.</p>
          <SkillsManager skills={f.skills ?? []} onChange={(s) => set('skills', s)} />
          <button style={{ ...saveBtn, marginTop: 16 }} onClick={() => updateMutation.mutate({ skills: f.skills })} disabled={updateMutation.isPending}>
            <Save size={14} /> {updateMutation.isPending ? 'Saving…' : 'Save Skills'}
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div>
        <div style={sectionCard}>
          <div style={sectionTitle}><Camera size={15} style={{ color: '#0dcaf0' }} /> Profile Photo</div>
          <AvatarUpload
            current={f.profilePhotoUrl ?? null}
            uploading={photoMutation.isPending}
            onUpload={(file) => { const fd = new FormData(); fd.append('photo', file); photoMutation.mutate(fd) }}
          />
        </div>

        <div style={sectionCard}>
          <div style={sectionTitle}><Upload size={15} style={{ color: '#0dcaf0' }} /> CV / Resume</div>
          {f.cvUrl ? (
            <div style={{ marginBottom: 12 }}>
              <a href={f.cvUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#0aa8cc', textDecoration: 'none', fontWeight: 600 }}>
                <CheckCircle size={14} /> View current CV
              </a>
            </div>
          ) : null}
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, padding: '28px 16px', borderRadius: 10,
            border: '2px dashed rgba(13,202,240,0.3)', background: 'rgba(13,202,240,0.03)',
            cursor: 'pointer',
          }}>
            <Upload size={28} style={{ color: '#0dcaf0' }} />
            <span style={{ fontSize: '0.82rem', color: '#5a8fa3', textAlign: 'center' }}>
              {cvMutation.isPending ? 'Uploading…' : 'Click to upload CV'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#9bbfcc' }}>PDF only. Max 5MB.</span>
            <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) { const fd = new FormData(); fd.append('cv', f); cvMutation.mutate(fd) } }} />
          </label>
        </div>
      </div>

      <style>{`@media(max-width:768px){.profile-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SUPERVISOR PROFILE
// ─────────────────────────────────────────────────────────────
function SupervisorProfile({ user }: { user: any }) {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['supervisor-profile'], queryFn: userApi.getSupervisorProfile })
  const p = data?.data?.data ?? {}
  const [form, setForm] = useState<any>(null)
  if (!form && p.firstName) setTimeout(() => setForm({ ...p }), 0)
  const f = form ?? p
  const set = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }))
  const mutation = useMutation({ mutationFn: (d: any) => userApi.updateSupervisorProfile(d), onSuccess: () => { toast.success('Profile saved!'); qc.invalidateQueries({ queryKey: ['supervisor-profile'] }) }, onError: () => toast.error('Save failed') })
  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div style={sectionCard}>
      <div style={sectionTitle}><User size={15} style={{ color: '#0dcaf0' }} /> Personal Information</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label style={labelStyle}>First Name</label><input value={f.firstName ?? ''} onChange={(e) => set('firstName', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Last Name</label><input value={f.lastName ?? ''} onChange={(e) => set('lastName', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Email</label><input value={user?.email ?? ''} disabled style={{ ...inputStyle, background: '#f4fbfd', color: '#9bbfcc' }} /></div>
        <div><label style={labelStyle}>Phone</label><input value={f.phone ?? ''} onChange={(e) => set('phone', e.target.value)} placeholder="+260 700 000 000" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Title</label><input value={f.title ?? ''} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Professor, Dr." style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Department</label><input value={f.department ?? ''} onChange={(e) => set('department', e.target.value)} placeholder="e.g. Computer Science" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Institution</label><input value={f.institution ?? ''} onChange={(e) => set('institution', e.target.value)} placeholder="e.g. University of Rwanda" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Specialization</label><input value={f.specialization ?? ''} onChange={(e) => set('specialization', e.target.value)} placeholder="e.g. Software Engineering" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
      </div>
      <button style={{ ...saveBtn, marginTop: 20 }} onClick={() => mutation.mutate(f)} disabled={mutation.isPending}>
        <Save size={14} /> {mutation.isPending ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// COMPANY PROFILE
// ─────────────────────────────────────────────────────────────
function CompanyProfile({ user }: { user: any }) {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['company-profile'], queryFn: userApi.getCompanyProfile })
  const p = data?.data?.data ?? {}
  const [form, setForm] = useState<any>(null)
  if (!form && p.companyName) setTimeout(() => setForm({ ...p }), 0)
  const f = form ?? p
  const set = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }))
  const mutation = useMutation({ mutationFn: (d: any) => userApi.updateCompanyProfile(d), onSuccess: () => { toast.success('Profile saved!'); qc.invalidateQueries({ queryKey: ['company-profile'] }) }, onError: () => toast.error('Save failed') })
  const logoMutation = useMutation({ mutationFn: (fd: FormData) => userApi.uploadLogo(fd), onSuccess: () => { toast.success('Logo updated!'); qc.invalidateQueries({ queryKey: ['company-profile'] }) }, onError: () => toast.error('Upload failed') })
  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }} className="profile-grid">
      <div>
        <div style={sectionCard}>
          <div style={sectionTitle}><Building2 size={15} style={{ color: '#0dcaf0' }} /> Company Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>Company Name</label><input value={f.companyName ?? ''} onChange={(e) => set('companyName', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div><label style={labelStyle}>Industry</label><input value={f.industry ?? ''} onChange={(e) => set('industry', e.target.value)} placeholder="e.g. Technology" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div><label style={labelStyle}>Email</label><input value={f.email ?? user?.email ?? ''} onChange={(e) => set('email', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div><label style={labelStyle}>Phone</label><input value={f.phone ?? ''} onChange={(e) => set('phone', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div><label style={labelStyle}>Website</label><input value={f.website ?? ''} onChange={(e) => set('website', e.target.value)} placeholder="https://" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div><label style={labelStyle}>City</label><input value={f.city ?? ''} onChange={(e) => set('city', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
            <div><label style={labelStyle}>Country</label><input value={f.country ?? ''} onChange={(e) => set('country', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={labelStyle}>Description</label>
            <textarea value={f.description ?? ''} onChange={(e) => set('description', e.target.value)} rows={3} placeholder="Brief description of your company…" style={{ ...inputStyle, resize: 'none' }} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} />
          </div>
          <button style={{ ...saveBtn, marginTop: 16 }} onClick={() => mutation.mutate(f)} disabled={mutation.isPending}>
            <Save size={14} /> {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
      <div style={sectionCard}>
        <div style={sectionTitle}><Camera size={15} style={{ color: '#0dcaf0' }} /> Company Logo</div>
        <AvatarUpload current={f.logoUrl ?? null} uploading={logoMutation.isPending}
          onUpload={(file) => { const fd = new FormData(); fd.append('logo', file); logoMutation.mutate(fd) }} />
      </div>
      <style>{`@media(max-width:768px){.profile-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// UNIVERSITY PROFILE
// ─────────────────────────────────────────────────────────────
function UniversityProfileView({ user }: { user: any }) {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['university-profile'], queryFn: universityApi.getProfile })
  const p = data?.data?.data ?? {}
  const [form, setForm] = useState<any>(null)
  if (!form && p.universityName) setTimeout(() => setForm({ ...p }), 0)
  const f = form ?? p
  const set = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }))
  const mutation = useMutation({ mutationFn: (d: any) => universityApi.updateProfile(d), onSuccess: () => { toast.success('Profile saved!'); qc.invalidateQueries({ queryKey: ['university-profile'] }) }, onError: () => toast.error('Save failed') })
  if (isLoading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div style={sectionCard}>
      <div style={sectionTitle}><GraduationCap size={15} style={{ color: '#0dcaf0' }} /> University Information</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>University Name</label><input value={f.universityName ?? ''} onChange={(e) => set('universityName', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Contact Person</label><input value={f.contactPersonName ?? ''} onChange={(e) => set('contactPersonName', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Email</label><input value={f.email ?? user?.email ?? ''} onChange={(e) => set('email', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Phone</label><input value={f.phone ?? ''} onChange={(e) => set('phone', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Website</label><input value={f.website ?? ''} onChange={(e) => set('website', e.target.value)} placeholder="https://" style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>City</label><input value={f.city ?? ''} onChange={(e) => set('city', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
        <div><label style={labelStyle}>Country</label><input value={f.country ?? ''} onChange={(e) => set('country', e.target.value)} style={inputStyle} onFocus={(e) => (e.currentTarget.style.borderColor = '#0dcaf0')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(13,202,240,0.25)')} /></div>
      </div>
      <button style={{ ...saveBtn, marginTop: 20 }} onClick={() => mutation.mutate(f)} disabled={mutation.isPending}>
        <Save size={14} /> {mutation.isPending ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — renders the right form based on role
// ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  const displayName =
    user.studentProfile    ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`      :
    user.supervisorProfile ? `${user.supervisorProfile.firstName} ${user.supervisorProfile.lastName}` :
    user.companyProfile    ? user.companyProfile.companyName                                          :
    user.adminProfile      ? `${user.adminProfile.firstName} ${user.adminProfile.lastName}`           :
    user.universityProfile ? user.universityProfile.universityName                                    :
    user.email

  const avatar =
    user.studentProfile?.profilePhotoUrl    ??
    user.supervisorProfile?.profilePhotoUrl ??
    user.companyProfile?.logoUrl            ??
    user.universityProfile?.logoUrl         ??
    null

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Banner ── */}
      <div style={{
        borderRadius: 16, marginBottom: 28, overflow: 'hidden',
        background: 'linear-gradient(135deg, #0dcaf0 0%, #0aa8cc 60%, #0890b0 100%)',
        padding: '28px 28px 24px',
        position: 'relative',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -20, top: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>
          {/* Avatar */}
          {avatar ? (
            <img src={avatar} alt={displayName} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.5)', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={32} color="#fff" />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{displayName}</h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
              <Briefcase size={11} /> {ROLE_LABEL[user.role] ?? user.role}
            </span>
          </div>
        </div>
      </div>

      {/* ── Role-specific form ── */}
      {user.role === 'STUDENT'                                       && <StudentProfile user={user} />}
      {(user.role === 'ACADEMIC_SUPERVISOR' || user.role === 'SITE_SUPERVISOR') && <SupervisorProfile user={user} />}
      {user.role === 'COMPANY'                                       && <CompanyProfile user={user} />}
      {user.role === 'UNIVERSITY'                                    && <UniversityProfileView user={user} />}
      {user.role === 'ADMIN' && (
        <div style={sectionCard}>
          <div style={sectionTitle}><User size={15} style={{ color: '#0dcaf0' }} /> Account Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={labelStyle}>Email</label><input value={user.email} disabled style={{ ...inputStyle, background: '#f4fbfd', color: '#9bbfcc' }} /></div>
            <div><label style={labelStyle}>Role</label><input value="Administrator" disabled style={{ ...inputStyle, background: '#f4fbfd', color: '#9bbfcc' }} /></div>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#9bbfcc', marginTop: 14 }}>Admin accounts are managed by the system. Contact support to update credentials.</p>
        </div>
      )}
    </div>
  )
}
