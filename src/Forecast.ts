
let apiUrlWeather:string = "https://www.prevision-meteo.ch/services/json/";


export class Forecast{


    constructor(
        public errors:errorCode[],
        public city_info:CityInfo,
        public forecast_info:ForecastInfo,
        public current_condition:CurrentCondition,
        public fcst_day_1:ForecastDay,
        public fcst_day_2:ForecastDay,
        public fcst_day_3:ForecastDay,
        public fcst_day_0:ForecastDay,
    ){
        
    }

    
    static getForecast(city:string): Promise<Forecast> {
        return fetch(apiUrlWeather+city)
                .then(res =>{
                    return res.json()
                })
                .then(res=>Forecast.fromJSON(res));   
    }

    static fromJSON(json: ForecastJson|string): Forecast {
        if (typeof json === 'string') {
          return JSON.parse(json);
        } else {
          let forecast = Object.create(Forecast.prototype);
          return Object.assign(forecast, json);
        }
      }


    getArrayHourlyData(forecastDay:ForecastDay):Data[]{
        let res:Data[]= [];
        res.push(forecastDay.hourly_data["3H00"]);
        res.push(forecastDay.hourly_data["6H00"]);
        res.push(forecastDay.hourly_data["9H00"]);
        res.push(forecastDay.hourly_data["12H00"]);
        res.push(forecastDay.hourly_data["15H00"]);
        res.push(forecastDay.hourly_data["18H00"]);
        res.push(forecastDay.hourly_data["21H00"]);
        
        return res;
    }

    getArrayNextDays():ForecastDay[]{
        let res:ForecastDay[]=[];
        res.push(this.fcst_day_0);
        res.push(this.fcst_day_1);
        res.push(this.fcst_day_2);
        res.push(this.fcst_day_3);
        return res;
    }

}





interface ForecastJson{
    errors:errorCode[],
    city_info:CityInfo,
    forecast_info:ForecastInfo,
    current_condition:CurrentCondition,
    fcst_day_0:ForecastDay,
    fcst_day_1:ForecastDay,
    fcst_day_2:ForecastDay,
    fcst_day_3:ForecastDay,
}





interface ForecastInfo{
    latitude:number,
    longitude:number,
    elevation:number
}

interface ForecastDay{
    date:string,
    day_short:string,
    tmin:number,
    tmax:number,
    condition:string,
    icon:string,
    hourly_data:HourlyData
    
}

interface HourlyData{
    "3H00":Data,
    "6H00": Data,
    "9H00":Data,
    "12H00":Data,
    "15H00":Data,
    "18H00":Data,
    "21H00":Data,
}


export interface Data{
    ICON:string,
    CONDITION:string,
    TMP2m:number,
    APCPsfc:number
}
interface errorCode{
    code:number,
    description:string,
    text:string
}


export interface CityList{
    input:string,
    cities:City[]|[]
}



interface City{
    code:number|string,
    city:string,
}



interface CityInfo{
    name:string,
    latitude:number,
    longitude:number,
    sunrise:string,
    sunset:string
}

interface CurrentCondition{
    date:string,
    heure:number,
    tmp:number,
    wnd_spd:number,
    humidity:number,
    condition:string,
    pressure:number,
    icon_big:string
}

interface Weather{
    city_info:CityInfo,
    current_condition:CurrentCondition
}
