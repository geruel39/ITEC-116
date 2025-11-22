import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
  @ApiProperty()
  city: string;

  @ApiProperty()
  temperature: number;

  @ApiProperty()
  condition: string;
}