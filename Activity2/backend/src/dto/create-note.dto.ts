import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ example: 'Meeting notes' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Discuss project milestones' })
  @IsString()
  content: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;
}
