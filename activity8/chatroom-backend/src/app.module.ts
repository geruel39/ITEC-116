import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './chatrooms/chatroom.entity';
import { Message } from './messages/message.entity';
import { ChatroomsModule } from './chatrooms/chatrooms.module';
import { MessagesModule } from './messages/messages.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      entities: [Chatroom, Message],
      synchronize: true, // dev only
    }),
    ChatroomsModule,
    MessagesModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}
