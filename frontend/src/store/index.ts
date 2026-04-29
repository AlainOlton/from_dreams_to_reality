import { create } from 'zustand'
import type { Notification } from '@/types'

interface NotificationStore {
  notifications:    Notification[]
  unreadCount:      number
  addNotification:  (n: Notification) => void
  setNotifications: (list: Notification[]) => void
  markRead:         (id: string) => void
  markAllRead:      () => void
  incrementUnread:  () => void
  clearUnread:      () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount:   0,

  addNotification: (n) =>
    set((s) => ({ notifications: [n, ...s.notifications] })),

  setNotifications: (list) =>
    set({ notifications: list, unreadCount: list.filter(n => !n.isRead).length }),

  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
      unreadCount:   Math.max(0, s.unreadCount - 1),
    })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount:   0,
    })),

  incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  clearUnread:     () => set({ unreadCount: 0 }),
}))

// ── Sidebar collapse state ────────────────────────────────────
interface UIStore {
  sidebarOpen:    boolean
  toggleSidebar:  () => void
  setSidebarOpen: (v: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen:    true,
  toggleSidebar:  () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
}))
