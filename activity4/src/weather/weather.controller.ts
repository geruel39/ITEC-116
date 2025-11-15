import { Controller, Get, Query, HttpException } from "@nestjs/common";
import { WeatherService } from "./weather.service";

@Controller("weather")
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query("city") city: string) {
    if (!city) {
      throw new HttpException("City query parameter is required", 400);
    }
    return this.weatherService.getWeather(city);
  }
}
