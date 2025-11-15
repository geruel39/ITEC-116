import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './author.entity';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private service: AuthorsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Author created', type: Author })
  create(@Body() dto: CreateAuthorDto) {
    return this.service.create(dto.name);
  }

  @Get()
  @ApiOkResponse({ description: 'All authors returned', type: [Author] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Author found', type: Author })
  @ApiNotFoundResponse({ description: 'Author not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Author updated', type: Author })
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.service.update(Number(id), dto.name);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Author deleted' })
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}