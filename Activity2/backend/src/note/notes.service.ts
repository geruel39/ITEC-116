import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private repo: Repository<Note>) {}

  async create(title: string, content: string, userId: number) {
    const note = this.repo.create({
        title,
        content,
        user: { id: userId }, // ✅ link user
    });
    return this.repo.save(note);
    }


  findAll(userId: number) {
    return this.repo.find({ where: { user: { id: userId } } });
  }

  async update(id: number, updateData: { title?: string; content?: string }) {
    const note = await this.repo.findOne({ where: { id } });
    if (!note) throw new Error('Note not found');
    
    Object.assign(note, updateData);
    return this.repo.save(note);
    }


  async remove(id: number) {
    await this.repo.delete(id);
    return { deleted: true };
  }

  async findAllByUser(userId: number) {
  return this.repo.find({
    where: { user: { id: userId } },
    relations: ['user'],
  });
}

}
