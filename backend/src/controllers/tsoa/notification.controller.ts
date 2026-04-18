import 'reflect-metadata'
import {
  Controller,
  Get,
  Patch,
  Path,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa'
import type { Request as ExpressRequest } from 'express'
import { prisma } from '@/config/db'
import type { MessageResponse } from './auth.controller'

@Route('api/notifications')
@Tags('Notifications')
@Security('bearerAuth')
export class NotificationController extends Controller {

  /** Get the 50 most recent notifications for the authenticated user */
  @Get('/')
  public async getNotifications(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const notifications = await prisma.notification.findMany({
      where:   { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take:    50,
    })
    return { success: true, message: 'Success', data: notifications }
  }

  /** Mark a single notification as read */
  @Patch('{id}/read')
  public async markAsRead(
    @Path() id: string,
  ): Promise<MessageResponse> {
    await prisma.notification.update({
      where: { id },
      data:  { isRead: true, readAt: new Date() },
    })
    return { success: true, message: 'Marked as read' }
  }

  /** Mark all notifications as read for the authenticated user */
  @Patch('read-all')
  public async markAllAsRead(@Request() req: ExpressRequest): Promise<MessageResponse> {
    await prisma.notification.updateMany({
      where: { userId: req.user!.id, isRead: false },
      data:  { isRead: true, readAt: new Date() },
    })
    return { success: true, message: 'All notifications marked as read' }
  }
}
