import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './book.entity';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private service: BooksService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Book created', type: Book })
  create(@Body() dto: CreateBookDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOkResponse({ description: 'All books returned', type: [Book] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Book found', type: Book })
  @ApiNotFoundResponse({ description: 'Book not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Book updated', type: Book })
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Book deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}