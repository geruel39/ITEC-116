import { Injectable, HttpException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { CreateWeatherDto } from "./dto/create-weather.dto";
import { WeatherResponseDto } from "./dto/weather-response.dto";

@Injectable()
export class WeatherService {
  constructor(private readonly httpService: HttpService) {}

  private apiKey = "8387b43714e736b0d4296517564e1201";

  async getWeather(dto: CreateWeatherDto): Promise<WeatherResponseDto> {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(apiUrl, {
          params: {
            q: `${dto.city},PH`,
            appid: this.apiKey,
            units: "metric",
          },
        })
      );

      const data = response.data;

      return {
        city: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].description,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || "Failed to fetch weather data",
        error.response?.status || 500
      );
    }
  }
}