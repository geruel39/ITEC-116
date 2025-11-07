import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';

class CreateBookDto {
  title: string;
  description?: string;
  authorId: number;
  categoryId: number;
}

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private service: BooksService) {}

  @Post()
  create(@Body() body: CreateBookDto) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateBookDto>) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
