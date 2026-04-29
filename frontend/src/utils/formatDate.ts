import { format, formatDistanceToNow, parseISO } from 'date-fns'

export const fmt      = (d: string, pattern = 'dd MMM yyyy')      => format(parseISO(d), pattern)
export const fmtTime  = (d: string)                                => format(parseISO(d), 'dd MMM yyyy, HH:mm')
export const fmtShort = (d: string)                                => format(parseISO(d), 'MMM dd')
export const timeAgo  = (d: string)                                => formatDistanceToNow(parseISO(d), { addSuffix: true })
