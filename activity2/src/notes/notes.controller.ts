import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes for current user' })
  async findAll(@Request() req: any) {
    return this.notesService.findAllForUser(req.user);
  }

  @Post()
  @ApiOperation({ summary: 'Create a note' })
  async create(@Request() req: any, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single note by id' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.notesService.findOneForUser(Number(id), req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note' })
  async update(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(Number(id), req.user, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.notesService.remove(Number(id), req.user);
  }
}
