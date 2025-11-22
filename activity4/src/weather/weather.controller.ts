import { Controller, Get, Query, HttpException } from "@nestjs/common";
import { WeatherService } from "./weather.service";
import { CreateWeatherDto } from "./dto/create-weather.dto";
import { WeatherResponseDto } from "./dto/weather-response.dto";
import { ApiTags, ApiQuery, ApiResponse } from "@nestjs/swagger";

@ApiTags("weather")
@Controller("weather")
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiQuery({ name: "city", type: String })
  @ApiResponse({ status: 200, type: WeatherResponseDto })
  async getWeather(@Query("city") city: string): Promise<WeatherResponseDto> {
    if (!city) {
      throw new HttpException("City query parameter is required", 400);
    }
    return this.weatherService.getWeather({ city });
  }
}