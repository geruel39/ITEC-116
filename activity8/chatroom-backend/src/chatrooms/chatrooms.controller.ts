import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ChatroomsService } from './chatrooms.service';

@Controller('chatrooms')
export class ChatroomsController {
  constructor(private readonly svc: ChatroomsService) {}

  @Get()
  all() { return this.svc.getAll(); }

  @Post()
  create(@Body() body: { name: string }) {
    return this.svc.create(body.name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.svc.delete(Number(id));
    return { success: true };
  }
}
