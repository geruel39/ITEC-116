import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Category created', type: Category })
  create(@Body() body: CreateCategoryDto) {
    return this.service.create(body.name);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List all categories', type: [Category] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Category found', type: Category })
  @ApiNotFoundResponse({ description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Category updated', type: Category })
  update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.service.update(Number(id), body.name);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Category deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}