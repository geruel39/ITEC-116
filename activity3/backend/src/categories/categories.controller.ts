import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

class CreateCategoryDto {
  name: string;
}

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Post()
  create(@Body() body: CreateCategoryDto) {
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
  update(@Param('id') id: string, @Body() body: CreateCategoryDto) {
    return this.service.update(Number(id), body.name);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
