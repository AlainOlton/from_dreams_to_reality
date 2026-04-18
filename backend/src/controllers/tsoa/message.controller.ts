import 'reflect-metadata'
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Request,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa'
import type { Request as ExpressRequest } from 'express'
import * as messageService from '@/services/message.service'
import type { MessageResponse } from './auth.controller'

// ── Models ────────────────────────────────────────────────────

export interface StartConversationBody {
  /** User ID of the person to start a conversation with */
  recipientId: string
}

export interface SendMessageBody {
  content: string
}

// ── Controller ────────────────────────────────────────────────

@Route('api/messages')
@Tags('Messages')
@Security('bearerAuth')
export class MessageController extends Controller {

  /** Get all conversations for the authenticated user */
  @Get('/')
  public async getConversations(@Request() req: ExpressRequest): Promise<MessageResponse> {
    const result = await messageService.getConversations(req.user!.id)
    return { success: true, message: 'Success', data: result }
  }

  /**
   * Start or retrieve an existing conversation with another user.
   * Returns the conversation object (idempotent).
   */
  @Post('start')
  public async startConversation(
    @Request() req: ExpressRequest,
    @Body() body: StartConversationBody,
  ): Promise<MessageResponse> {
    const result = await messageService.getOrCreateConversation(req.user!.id, body.recipientId)
    return { success: true, message: 'Success', data: result }
  }

  /** Get all messages in a conversation */
  @Get('{conversationId}')
  public async getMessages(
    @Path() conversationId: string,
    @Request() req: ExpressRequest,
  ): Promise<MessageResponse> {
    const result = await messageService.getMessages(req.user!.id, conversationId)
    return { success: true, message: 'Success', data: result }
  }

  /**
   * Send a message in a conversation.
   * File attachments are handled via multipart/form-data in the actual endpoint.
   * Real-time delivery is handled via Socket.IO (`conversation:{id}` room).
   */
  @Post('{conversationId}')
  @SuccessResponse(201, 'Created')
  public async sendMessage(
    @Path() conversationId: string,
    @Request() req: ExpressRequest,
    @Body() body: SendMessageBody,
  ): Promise<MessageResponse> {
    const message = await messageService.sendMessage(
      req.user!.id,
      conversationId,
      body.content,
    )
    this.setStatus(201)
    return { success: true, message: 'Message sent', data: message }
  }
}
