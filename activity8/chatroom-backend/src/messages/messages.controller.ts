import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private svc: MessagesService) {}

  @Get(':roomId')
  get(@Param('roomId') roomId: string) {
    return this.svc.getMessages(Number(roomId));
  }

  @Post()
  create(@Body() body: { roomId: number; sender: string; text: string }) {
    return this.svc.sendMessage(body);
  }
}
