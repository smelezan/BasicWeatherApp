let apiUrlWeather = "https://www.prevision-meteo.ch/services/json/";
export class OpenWeatherMapForecast {
    constructor(cod, message, cnt, list, city, country, sunrise, sunset) {
        this.cod = cod;
        this.message = message;
        this.cnt = cnt;
        this.list = list;
        this.city = city;
        this.country = country;
        this.sunrise = sunrise;
        this.sunset = sunset;
    }
    static fromJSON(json) {
        if (typeof json === 'string') {
            return JSON.parse(json);
        }
        else {
            let forecast = Object.create(OpenWeatherMapForecast.prototype);
            return Object.assign(forecast, json);
        }
    }
    static getForecast(city) {
        return fetch(apiUrlWeather + city)
            .then(res => {
            console.log(res);
            return res.json();
        })
            .then(res => OpenWeatherMapForecast.fromJSON(res));
    }
    get3NextDayInfos() {
        let res = [];
        //Récupérer les 3 prochains jours
        // Parcourir la liste 
        //si c'est un autre jour, on l'ajoute à la liste
        let flag = false;
        let date = undefined;
        for (let i = 0; i < this.list.length; i++) {
            let current_date = new Date(this.list[i].dt_txt);
            if (date == undefined || current_date.getDay() > date.getDay()) {
                console.log("on a changé de date");
                res.push(this.list[i]);
            }
            else {
                console.log("c'est toujours le même jour");
            }
        }
        return res;
    }
}
