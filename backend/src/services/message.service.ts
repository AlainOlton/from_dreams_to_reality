import { prisma } from '@/config/db'

export const getOrCreateConversation = async (userIdA: string, userIdB: string) => {
  // Find existing conversation between exactly these two users
  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId: userIdA } } },
        { participants: { some: { userId: userIdB } } },
      ],
    },
    include: { participants: true },
  })

  if (existing) return existing

  return prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId: userIdA }, { userId: userIdB }],
      },
    },
    include: { participants: true },
  })
}

export const sendMessage = async (
  senderId:        string,
  conversationId:  string,
  content:         string,
  attachmentUrl?:  string
) => {
  // Verify sender is a participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: senderId } },
  })
  if (!participant) throw Object.assign(new Error('You are not part of this conversation'), { statusCode: 403 })

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, senderId, content, attachmentUrl },
      include: { sender: { select: { id: true, role: true } } },
    }),
    prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } }),
    prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId: senderId } },
      data:  { lastReadAt: new Date() },
    }),
  ])

  return message
}

export const getConversations = async (userId: string) => {
  return prisma.conversation.findMany({
    where:   { participants: { some: { userId } } },
    orderBy: { updatedAt: 'desc' },
    include: {
      participants: {
        where:   { userId: { not: userId } },
        include: {
          // @ts-ignore — nested select via custom relation
        },
      },
      messages: {
        orderBy: { sentAt: 'desc' },
        take:    1,
      },
    },
  })
}

export const getMessages = async (userId: string, conversationId: string) => {
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  })
  if (!participant) throw Object.assign(new Error('Forbidden'), { statusCode: 403 })

  // Mark as read
  await prisma.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data:  { lastReadAt: new Date() },
  })

  return prisma.message.findMany({
    where:   { conversationId },
    orderBy: { sentAt: 'asc' },
    include: { sender: { select: { id: true, role: true } } },
  })
}
