import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatroom } from './chatroom.entity';
import { Repository } from 'typeorm';
import { Message } from '../messages/message.entity';

@Injectable()
export class ChatroomsService {
  constructor(
    @InjectRepository(Chatroom) private repo: Repository<Chatroom>,
    @InjectRepository(Message) private msgRepo: Repository<Message>
  ) {}

  getAll() {
    return this.repo.find();
  }

  create(name: string) {
    const r = this.repo.create({ name });
    return this.repo.save(r);
  }

  async delete(id: number) {
    // Delete all messages for this room first
    await this.msgRepo.delete({ roomId: id });
    await this.repo.delete(id);
  }
}
