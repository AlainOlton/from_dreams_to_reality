import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messageApi, userApi } from '@/api/endpoints'
import { useAuth }   from '@/context/AuthContext'
import { useSocket } from '@/context/SocketContext'
import Spinner    from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import Modal      from '@/components/common/Modal'
import { timeAgo } from '@/utils/formatDate'
import { getRoleLabel } from '@/utils/roleHelpers'
import { MessageSquare, Send, Plus, Search, Paperclip, Check, CheckCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Conversation, Message } from '@/types'

export default function SupervisorMessages() {
  const { user }                        = useAuth()
  const { socket, joinConversation,
          leaveConversation,
          sendTypingStart, sendTypingStop } = useSocket()
  const qc = useQueryClient()

  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [messages,     setMessages]     = useState<Message[]>([])
  const [text,         setText]         = useState('')
  const [attachment,   setAttachment]   = useState<File | null>(null)
  const [newChatOpen,  setNewChatOpen]  = useState(false)
  const [recipientId,  setRecipientId]  = useState('')
  const [search,       setSearch]       = useState('')
  const [typingUser,   setTypingUser]   = useState<string | null>(null)
  const [isTyping,     setIsTyping]     = useState(false)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileRef     = useRef<HTMLInputElement>(null)

  const { data: convData, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn:  messageApi.getConversations,
  })
  const conversations: Conversation[] = convData?.data?.data ?? []

  const { data: usersData } = useQuery({
    queryKey: ['all-users-for-chat'],
    queryFn:  userApi.getAllUsersForChat,
  })
  const allUsers: any[] = (usersData?.data?.data ?? []).filter((u: any) => u.id !== user?.id)

  useEffect(() => {
    if (!activeConvId) return
    messageApi.getMessages(activeConvId)
      .then((res) => setMessages(res.data?.data ?? []))
      .catch(() => toast.error('Could not load messages'))
    joinConversation(activeConvId)
    return () => { leaveConversation(activeConvId) }
  }, [activeConvId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!socket) return
    const onMsg = (msg: Message) => {
      if (msg.conversationId === activeConvId) setMessages((p) => [...p, msg])
      qc.invalidateQueries({ queryKey: ['conversations'] })
    }
    const onType    = ({ userId }: any) => { if (userId !== user?.id) setTypingUser(userId) }
    const onStop    = () => setTypingUser(null)
    socket.on('new_message', onMsg)
    socket.on('user_typing', onType)
    socket.on('user_stopped_typing', onStop)
    return () => { socket.off('new_message', onMsg); socket.off('user_typing', onType); socket.off('user_stopped_typing', onStop) }
  }, [socket, activeConvId])

  const sendMutation = useMutation({
    mutationFn: (fd: FormData) => messageApi.sendMessage(activeConvId!, fd),
    onSuccess: (res) => {
      const msg: Message = res.data?.data
      if (msg) setMessages((p) => [...p, msg])
      setText(''); setAttachment(null)
      if (fileRef.current) fileRef.current.value = ''
      qc.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: () => toast.error('Send failed'),
  })

  const handleSend = () => {
    if (!text.trim() && !attachment) return
    const fd = new FormData()
    fd.append('content', text.trim() || ' ')
    if (attachment) fd.append('attachment', attachment)
    sendMutation.mutate(fd)
    sendTypingStop(activeConvId!)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    if (!activeConvId) return
    if (!isTyping) { setIsTyping(true); sendTypingStart(activeConvId) }
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => { setIsTyping(false); sendTypingStop(activeConvId) }, 1500)
  }

  const startConvMutation = useMutation({
    mutationFn: (rid: string) => messageApi.startConversation(rid),
    onSuccess: (res) => {
      setNewChatOpen(false); setRecipientId('')
      qc.invalidateQueries({ queryKey: ['conversations'] })
      const conv: Conversation = res.data?.data
      if (conv?.id) setActiveConvId(conv.id)
    },
    onError: () => toast.error('Could not start conversation'),
  })

  const getOther = (conv: Conversation) => {
    const other    = conv.participants?.find((p) => p.userId !== user?.id)
    const otherUser = allUsers.find((u: any) => u.id === other?.userId)
    if (!otherUser) return { name: 'Unknown', role: '' }
    const name =
      otherUser.studentProfile    ? `${otherUser.studentProfile.firstName} ${otherUser.studentProfile.lastName}` :
      otherUser.supervisorProfile ? `${otherUser.supervisorProfile.firstName} ${otherUser.supervisorProfile.lastName}` :
      otherUser.companyProfile    ? otherUser.companyProfile.companyName :
      otherUser.email
    return { name, role: getRoleLabel(otherUser.role) }
  }

  const filtered = conversations.filter((c) => {
    if (!search) return true
    const { name } = getOther(c)
    return name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div>
      <div className="page-header">
        <h1>Messages</h1>
        <button onClick={() => setNewChatOpen(true)} className="btn-primary"><Plus size={16} /> New conversation</button>
      </div>

      <div className="card flex overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 border-r border-gray-100 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className="input pl-8 py-1.5 text-xs" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? <div className="flex justify-center py-8"><Spinner /></div>
              : filtered.length === 0
                ? <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <MessageSquare size={32} className="text-gray-200 mb-2" />
                    <p className="text-xs text-gray-400">No conversations</p>
                  </div>
                : filtered.map((conv) => {
                    const { name, role } = getOther(conv)
                    const last = conv.messages?.[0]
                    const active = activeConvId === conv.id
                    return (
                      <div key={conv.id} onClick={() => setActiveConvId(conv.id)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${active ? 'bg-brand-50' : 'hover:bg-gray-50'}`}>
                        <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-semibold truncate ${active ? 'text-brand-700' : 'text-gray-900'}`}>{name}</p>
                            {last && <p className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{timeAgo(last.sentAt)}</p>}
                          </div>
                          <p className="text-[10px] text-gray-400 truncate">{role}</p>
                          {last && <p className="text-[11px] text-gray-400 truncate mt-0.5">{last.content}</p>}
                        </div>
                      </div>
                    )
                  })
            }
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col">
          {!activeConvId
            ? <div className="flex-1 flex items-center justify-center">
                <EmptyState icon={<MessageSquare size={40} />} title="Select a conversation" description="Choose one from the list or start a new one." />
              </div>
            : <>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {messages.map((msg) => {
                    const mine = msg.senderId === user?.id
                    return (
                      <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                          ${mine ? 'bg-brand-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'}`}>
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          {msg.attachmentUrl && (
                            <a href={msg.attachmentUrl} target="_blank" rel="noreferrer"
                              className={`flex items-center gap-1 mt-1 text-xs underline ${mine ? 'text-brand-100' : 'text-brand-600'}`}>
                              <Paperclip size={11} /> Attachment
                            </a>
                          )}
                          <div className={`flex items-center gap-1 mt-1 ${mine ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-[10px] ${mine ? 'text-brand-200' : 'text-gray-400'}`}>
                              {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {mine && (msg.readAt ? <CheckCheck size={11} className="text-brand-200" /> : <Check size={11} className="text-brand-200" />)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {typingUser && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          {[0, 150, 300].map((d) => (
                            <span key={d} className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                <div className="border-t border-gray-100 p-4">
                  {attachment && (
                    <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-brand-50 rounded-lg">
                      <Paperclip size={13} className="text-brand-500" />
                      <span className="text-xs text-brand-700 truncate">{attachment.name}</span>
                      <button onClick={() => { setAttachment(null); if (fileRef.current) fileRef.current.value = '' }}
                        className="text-brand-400 hover:text-brand-600 ml-auto text-xs">✕</button>
                    </div>
                  )}
                  <div className="flex items-end gap-3">
                    <button onClick={() => fileRef.current?.click()}
                      className="p-2 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 transition-colors flex-shrink-0">
                      <Paperclip size={18} />
                    </button>
                    <input ref={fileRef} type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] ?? null)} />
                    <textarea value={text} onChange={handleTextChange} onKeyDown={handleKeyDown} rows={1}
                      placeholder="Type a message… (Enter to send)"
                      className="input resize-none flex-1 max-h-32 overflow-y-auto py-2 text-sm" style={{ minHeight: '40px' }} />
                    <button onClick={handleSend} disabled={(!text.trim() && !attachment) || sendMutation.isPending}
                      className="btn-primary py-2 px-3 flex-shrink-0"><Send size={16} /></button>
                  </div>
                </div>
              </>
          }
        </div>
      </div>

      <Modal open={newChatOpen} onClose={() => setNewChatOpen(false)} title="Start new conversation" size="sm">
        <div className="space-y-4">
          <div>
            <label className="label">Select recipient</label>
            <select value={recipientId} onChange={(e) => setRecipientId(e.target.value)} className="input">
              <option value="">Choose a person…</option>
              {allUsers.map((u: any) => {
                const name = u.studentProfile ? `${u.studentProfile.firstName} ${u.studentProfile.lastName}` :
                  u.supervisorProfile ? `${u.supervisorProfile.firstName} ${u.supervisorProfile.lastName}` :
                  u.companyProfile ? u.companyProfile.companyName :
                  u.email
                return <option key={u.id} value={u.id}>{name} — {getRoleLabel(u.role)}</option>
              })}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button className="btn-secondary" onClick={() => setNewChatOpen(false)}>Cancel</button>
            <button className="btn-primary" disabled={!recipientId || startConvMutation.isPending}
              onClick={() => startConvMutation.mutate(recipientId)}>
              {startConvMutation.isPending ? 'Starting…' : 'Start chat'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
