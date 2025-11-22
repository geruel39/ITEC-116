import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './chatroom.entity';
import { Message } from '../messages/message.entity';
import { ChatroomsService } from './chatrooms.service';
import { ChatroomsController } from './chatrooms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chatroom, Message])],
  providers: [ChatroomsService],
  controllers: [ChatroomsController],
  exports: [ChatroomsService],
})
export class ChatroomsModule {}
