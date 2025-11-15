import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'The Hobbit', description: 'Title of the book' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A fantasy adventure', description: 'Optional description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, description: 'Author ID' })
  @IsInt()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty({ example: 2, description: 'Category ID' })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}