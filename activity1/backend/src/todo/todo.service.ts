import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  // 🟢 CREATE
  create(data: CreateTodoDto) {
    const todo = this.todoRepo.create(data);
    return this.todoRepo.save(todo);
  }

  // 🔵 READ (ALL)
  findAll() {
    return this.todoRepo.find();
  }

  // 🔵 READ (ONE)
  async findOne(id: number) {
    const todo = await this.todoRepo.findOne({ where: { id } });
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return todo;
  }

  // 🟡 UPDATE
  async update(id: number, data: UpdateTodoDto) {
    const todo = await this.findOne(id);
    Object.assign(todo, data);
    return this.todoRepo.save(todo);
  }

  // 🔴 DELETE
  async remove(id: number) {
    const todo = await this.findOne(id);
    return this.todoRepo.remove(todo);
  }
}
