export default function CompanyMessages() {
  return (
    <div>
      <div className="page-header"><h1>Messages</h1></div>
      <div className="card p-6 text-sm text-gray-500">Company Messages — implement here.</div>
    </div>
  )
}
// Company Messages page — identical chat UI, different role context
// Re-exports the supervisor messages pattern with company branding
export { default } from '@/pages/supervisor/Messages'
