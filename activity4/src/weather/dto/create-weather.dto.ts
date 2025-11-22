import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWeatherDto {
  @ApiProperty({ description: 'City name to fetch weather for' })
  @IsString()
  city: string;
}