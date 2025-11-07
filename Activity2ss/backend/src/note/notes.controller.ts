import { Controller, Get, Post, Body, Query, Param, Delete, Put } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  getNotes(@Query('userId') userId: number) {
    return this.notesService.findAllByUser(userId);
  }

  @Post()
  createNote(@Body() body: { title: string; content: string; userId: number }) {
    return this.notesService.create(body.title, body.content, body.userId);
  }

  @Put(':id')
    updateNote(
    @Param('id') id: number,
    @Body() body: { title?: string; content?: string },
    ) {
    return this.notesService.update(id, body);
    }


  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.notesService.remove(id);
  }
}
