let apiUrlWeather = "https://www.prevision-meteo.ch/services/json/";
export class Forecast {
    constructor(errors, city_info, forecast_info, current_condition, fcst_day_1, fcst_day_2, fcst_day_3, fcst_day_0) {
        this.errors = errors;
        this.city_info = city_info;
        this.forecast_info = forecast_info;
        this.current_condition = current_condition;
        this.fcst_day_1 = fcst_day_1;
        this.fcst_day_2 = fcst_day_2;
        this.fcst_day_3 = fcst_day_3;
        this.fcst_day_0 = fcst_day_0;
    }
    static getForecast(city) {
        return fetch(apiUrlWeather + city)
            .then(res => {
            return res.json();
        })
            .then(res => Forecast.fromJSON(res));
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json);
        }
        else {
            let forecast = Object.create(Forecast.prototype);
            return Object.assign(forecast, json);
        }
    }
    getArrayHourlyData(forecastDay) {
        let res = [];
        res.push(forecastDay.hourly_data["3H00"]);
        res.push(forecastDay.hourly_data["6H00"]);
        res.push(forecastDay.hourly_data["9H00"]);
        res.push(forecastDay.hourly_data["12H00"]);
        res.push(forecastDay.hourly_data["15H00"]);
        res.push(forecastDay.hourly_data["18H00"]);
        res.push(forecastDay.hourly_data["21H00"]);
        return res;
    }
    getArrayNextDays() {
        let res = [];
        res.push(this.fcst_day_0);
        res.push(this.fcst_day_1);
        res.push(this.fcst_day_2);
        res.push(this.fcst_day_3);
        return res;
    }
}
