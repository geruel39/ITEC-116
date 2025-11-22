import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from '../entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(@InjectRepository(Note) private notesRepo: Repository<Note>) {}

  async create(user: any, dto: CreateNoteDto) {
    const note = this.notesRepo.create({ ...dto, user });
    return this.notesRepo.save(note);
  }

  async findAllForUser(user: any) {
    return this.notesRepo.find({ where: { user: { id: user.id } } });
  }

  async findOneForUser(id: number, user: any) {
    const note = await this.notesRepo.findOne({ where: { id, user: { id: user.id } } });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async update(id: number, user: any, dto: UpdateNoteDto) {
    const note = await this.findOneForUser(id, user);
    Object.assign(note, dto);
    return this.notesRepo.save(note);
  }

  async remove(id: number, user: any) {
    const note = await this.findOneForUser(id, user);
    return this.notesRepo.remove(note);
  }
}
