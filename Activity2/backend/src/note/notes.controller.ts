import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from 'src/dto/create-note.dto';
import { UpdateNoteDto } from 'src/dto/update-note.dto';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes for a user' })
  @ApiResponse({ status: 200, description: 'List of notes returned' })
  getNotes(@Query('userId') userId: number) {
    return this.notesService.findAllByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully' })
  createNote(@Body() dto: CreateNoteDto) {
    return this.notesService.create(dto.title, dto.content, dto.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note by ID' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  updateNote(@Param('id') id: number, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note by ID' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  delete(@Param('id') id: number) {
    return this.notesService.remove(id);
  }
}