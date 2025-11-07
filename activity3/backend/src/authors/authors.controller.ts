import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';

class CreateAuthorDto {
  name: string;
}

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private service: AuthorsService) {}

  @Post()
  create(@Body() body: CreateAuthorDto) {
    return this.service.create(body.name);
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
  update(@Param('id') id: string, @Body() body: CreateAuthorDto) {
    return this.service.update(Number(id), body.name);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
