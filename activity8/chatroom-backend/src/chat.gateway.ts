import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages/messages.service';
import { ChatroomsService } from './chatrooms/chatrooms.service';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: true })
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private messagesSvc: MessagesService,
    private chatroomsSvc: ChatroomsService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: { roomId: number; sender: string; text: string }) {
    // persist message
    const saved = await this.messagesSvc.sendMessage(data);
    // broadcast to room only
    this.server.to(String(saved.roomId)).emit('newMessage', saved);
    return saved;
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody() data: { roomId: number }, @ConnectedSocket() client: Socket) {
    // Check if room exists in DB
    const room = await this.chatroomsSvc.getAll();
    if (!room.find(r => r.id === Number(data.roomId))) {
      client.emit('error', { message: 'Room does not exist.' });
      return;
    }
    client.join(String(data.roomId));
    client.emit('joinedRoom', { roomId: data.roomId });
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@MessageBody() data: { roomId: number }, @ConnectedSocket() client: Socket) {
    client.leave(String(data.roomId));
    client.emit('leftRoom', { roomId: data.roomId });
  }
}
