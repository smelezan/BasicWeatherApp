
let apiUrlWeather:string = "https://www.prevision-meteo.ch/services/json/";


export class OpenWeatherMapForecast{




    constructor(
        public cod:number,
        public message:string,
        public cnt:number,
        public list: Forecast[],
        public city: CityInfo,
        public country: string,
        public sunrise: number,
        public sunset:number
    ){

    }



    static fromJSON(json: OpenWeatherMapForecastJson|string): OpenWeatherMapForecast {
        if (typeof json === 'string') {
          return JSON.parse(json);
        } else {
          let forecast = Object.create(OpenWeatherMapForecast.prototype);
          return Object.assign(forecast, json);
        }
      }





    static getForecast(city:string): Promise<OpenWeatherMapForecast> {
        return fetch(apiUrlWeather+city)
                .then(res =>{
                    console.log(res);
                    return res.json()
                })
                .then(res=>OpenWeatherMapForecast.fromJSON(res));   
    }


    get3NextDayInfos(): Forecast[]{
        let res:Forecast[]= [];
        //Récupérer les 3 prochains jours
        // Parcourir la liste 
            //si c'est un autre jour, on l'ajoute à la liste

        let flag = false;
        let date: (Date|undefined) = undefined;


        for(let i:number =0; i< this.list.length ; i++){
            let current_date:Date= new Date(this.list[i].dt_txt);

            if( date ==undefined || current_date.getDay() > date!.getDay()){
                console.log("on a changé de date");
                res.push(this.list[i]);
            }
            else{
                console.log("c'est toujours le même jour");
            }
        }

        return res;
    }


}






interface OpenWeatherMapForecastJson{
    cod:number,
    message:string,
    cnt:number,
    list: Forecast[],
    city: CityInfo,
    country: string,
    sunrise: number,
    sunset:number

}

interface Forecast{
    main:MainInfos,
    weather:WeatherInfos,
    clouds : {all:number},
    wind : {speed:number, deg:number},
    rain: {rain: {"1h":number}},
    snow: {snow:{"1h":number}},
    dt_txt: string
}

interface CityInfo{
    id: number,
    name: string,
    coord:{ lat:number, lon:number},
}

interface MainInfos{
    temp:number,
    feel_like: number, 
    temp_min: number,
    temp_max: number, 
    humidity: number
}

interface WeatherInfos{
    id: number, 
    main: string, 
    description: string, 
    icon: string
}
