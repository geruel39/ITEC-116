import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  // 🟢 CREATE
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  create(@Body() data: CreateTodoDto) {
    return this.todoService.create(data);
  }

  // 🔵 READ (ALL)
  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  findAll() {
    return this.todoService.findAll();
  }

  // 🔵 READ (ONE)
  @Get(':id')
  @ApiOperation({ summary: 'Get one task by ID' })
  findOne(@Param('id') id: number) {
    return this.todoService.findOne(id);
  }

  // 🟡 UPDATE
  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  update(@Param('id') id: number, @Body() data: UpdateTodoDto) {
    return this.todoService.update(id, data);
  }

  // 🔴 DELETE
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id') id: number) {
    return this.todoService.remove(id);
  }
}
