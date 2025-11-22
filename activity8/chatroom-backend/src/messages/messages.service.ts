import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private repo: Repository<Message>) {}

  getMessages(roomId: number) {
    return this.repo.find({ where: { roomId }, order: { createdAt: 'ASC' } });
  }

  sendMessage(payload: { roomId: number; sender: string; text: string }) {
    const m = this.repo.create(payload);
    return this.repo.save(m);
  }
}
