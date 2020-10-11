import * as L from 'leaflet';
import {Map} from './Map';
/**
 * Format api -- 
 *  Demande météo
 * https://www.prevision-meteo.ch/services/json/[nom_ville][lat=xx.xxxlng=yy.yyy]
 * 
 * Demande liste des villes
 * https://www.prevision-meteo.ch/services/json/list-cities
 * 
 */


import {Forecast, CityList} from './Forecast.js';


let inputText:any= document.getElementById("input-text")!;
let displayButton:any= document.getElementById("display-button")!;
let apiUrlCityList:string = "https://vicopo.selfbuild.fr/cherche/";
displayButton.addEventListener("click", onClickDisplayButton);
let datalist:HTMLDataListElement= document.createElement("datalist");
datalist.id="cities";
inputText.addEventListener("keyup",onKeyDown)
document.getElementById("menu")!.appendChild(datalist);
let leafletMap = L.map('map').setView([46.227638, 2.213749], 6);
let map:Map = new Map(leafletMap);

window.onload= ()=>{
    createTodaysWeather();
    create3NextDays();
    Forecast.getForecast("Talence")
    .then(forecast => {
        updateGlobalInfos(forecast);
        updateTodayWeather(forecast);
        updateNextDays(forecast);
    });
}






function updateGlobalInfos(forecast:Forecast){
    document.querySelector('body > main > div.location-and-date > h1')!.innerHTML = forecast.city_info.name;
    document.querySelector('body > main > div.location-and-date > div')!.innerHTML = forecast.current_condition.date;
    document.querySelector('body > main > div.current-temperature > div.current-temperature__content-container > div.current-temperature__value')!.innerHTML = forecast.current_condition.tmp.toString()+"°";
    (<HTMLImageElement>document.querySelector('body > main > div.current-temperature > div.current-temperature__icon-container> img')).src = forecast.current_condition.icon_big;
    document.querySelector('body > main > div.current-temperature > div.current-temperature__content-container > div.current-temperature__summary')!.innerHTML = forecast.current_condition.condition;
    document.querySelector('body > main > div.current-stats > div:nth-child(1) > div:nth-child(1)')!.innerHTML = forecast.fcst_day_0.tmax.toString()+"°";
    document.querySelector('body > main > div.current-stats > div:nth-child(1) > div:nth-child(3)')!.innerHTML = forecast.fcst_day_0.tmin.toString()+"°";
    document.querySelector('body > main > div.current-stats > div:nth-child(2) > div:nth-child(1)')!.innerHTML = forecast.current_condition.wnd_spd.toString()+"km/h";
    document.querySelector('body > main > div.current-stats > div:nth-child(2) > div:nth-child(3)')!.innerHTML = forecast.current_condition.humidity.toString()+"%";
    document.querySelector('body > main > div.current-stats > div:nth-child(3) > div:nth-child(1)')!.innerHTML = forecast.city_info.sunrise.toString();
    document.querySelector('body > main > div.current-stats > div:nth-child(3) > div:nth-child(3)')!.innerHTML = forecast.city_info.sunset.toString();    
}



function updateTodayWeather(forecast:Forecast){
    const tab:any[]= ["3H00","6H00","9H00","12H00","15H00","18H00","21H00"];
    let i = 0;
    for (let data of forecast.getArrayHourlyData(forecast.fcst_day_0)) {
        document.querySelector('body > main > div.weather-by-hour > div > div:nth-child('+(i+1)+') > div.weather-by-hour__hour')!.innerHTML = tab[i];
        (<HTMLImageElement>document.querySelector('body > main > div.weather-by-hour > div > div:nth-child('+(i+1)+') > img')!).src = data.ICON;
        document.querySelector('body > main > div.weather-by-hour > div > div:nth-child('+(i+1)+') > div:nth-child(3)')!.innerHTML = data.TMP2m.toString()+"°";
        i+=1
    }
}


function updateNextDays(forecast:Forecast){
    let i:number=0;
    for(let day of forecast.getArrayNextDays()){
        if(i==0) {
            i++;
            continue;
        }
        document.querySelector('body > main > div.next-3-days > div > div:nth-child('+i+') > div.next-3-days__date > div:nth-child(1)')!.innerHTML = day.day_short;
        document.querySelector('body > main > div.next-3-days > div > div:nth-child('+i+') > div.next-3-days__date > div.next-3-days__label')!.innerHTML = day.date;
        document.querySelector('body > main > div.next-3-days > div > div:nth-child('+i+') > div.next-3-days__low > div:nth-child(1)')!.innerHTML = day.tmin.toString()+"°";
        document.querySelector('body > main > div.next-3-days > div > div:nth-child('+i+') > div.next-3-days__high > div:nth-child(1)')!.innerHTML = day.tmax.toString()+"°";
        (<HTMLImageElement>document.querySelector('body > main > div.next-3-days > div > div:nth-child('+i+') > div.next-3-days__icon > img')!).src = day.icon;
        i++;
    }
}


function onClickDisplayButton(){
    Forecast.getForecast(inputText.value)
    .then(forecast => {
        if(forecast.errors){
            window.alert("Nous n'avons pas de prévisions pour cette ville");
        }
        else{
        updateGlobalInfos(forecast);
        updateTodayWeather(forecast);
        updateNextDays(forecast);
        }
    });
}


function getCityList(cityStr:string): Promise<CityList>{
    return fetch(apiUrlCityList+cityStr,{mode:"cors"})
            .then(res =>res.json())
            .then(res => {
                    return res as CityList;
            });
}


function createDatalist(cityStr:string){
    deleteChild();
    getCityList(cityStr)
        .then(cities=>{
            let i:number=0;
            for(let city of cities.cities){
                //if(i>10) break;
                let cityOption:HTMLOptionElement = document.createElement('option');
                cityOption.value=city.city ;
                cityOption.innerHTML = city.code.toString();
                datalist.appendChild(cityOption);
                i+=1;
            }
        });
}


function deleteChild() { 
    var e = document.querySelector("datalist"); 
    var child = e!.lastElementChild;  
    while (child) { 
        e!.removeChild(child); 
        child = e!.lastElementChild; 
    } 
} 


function onKeyDown(){
    if(inputText.value.length > 2) createDatalist(inputText.value);
}


function create3NextDays(){
    let next3Days = document.querySelector('.next-3-days')!;

    for (let index = 0; index < 3; index++) {
        let next3Days_row = document.createElement('div');
        next3Days_row.className="next-3-days__row";

        let next3Days__date = document.createElement('div');
        next3Days__date.className="next-3-days__date";
        next3Days__date.appendChild(document.createElement('div'));
        let label1= document.createElement('div');
        label1.className="next-3-days__label";
        next3Days__date.appendChild(label1);


        let next3Days__low = document.createElement('div');
        next3Days__low.className="next-3-days__low";
        next3Days__low.appendChild(document.createElement('div'));
        let label2= document.createElement('div');
        label2.className="next-3-days__label";
        next3Days__low.appendChild(label2);


        let next3Days__high = document.createElement('div');
        next3Days__high.className="next-3-days__high";
        next3Days__high.appendChild(document.createElement('div'));
        let label3= document.createElement('div');
        label3.className="next-3-days__label";
        next3Days__high.appendChild(label3);

        let next3Days__icon = document.createElement('div');
        next3Days__icon.className="next-3-days__icon";
        let img= document.createElement('img');
        img.src="";
        next3Days__icon.appendChild(img);

        next3Days_row.appendChild(next3Days__date);
        next3Days_row.appendChild(next3Days__low);
        next3Days_row.appendChild(next3Days__high);
        next3Days_row.appendChild(next3Days__icon);

        document.querySelector('.next-3-days__container')!.appendChild(next3Days_row);
    }
}


function createTodaysWeather(){
    for (let index = 0; index < 7; index++) {


        let weather_by_hour_item= document.createElement('div');
        weather_by_hour_item.className='weather-by-hour__item';
        

        let hour = document.createElement('div');
        hour.className='weather-by-hour__hour';

        let image = document.createElement('img');
        image.src="";

        let temp = document.createElement('div');

        weather_by_hour_item.appendChild(hour);
        weather_by_hour_item.appendChild(image);
        weather_by_hour_item.appendChild(temp);

        document.querySelector('.weather-by-hour__container')!.appendChild(weather_by_hour_item);        
    }
}

leafletMap.on('click',onMapClick);



function onMapClick(e:any){
    map.onMapClick(e)
        .then( city => {
            Forecast.getForecast(city)
            .then(forecast => {
                if(forecast.errors){
                    window.alert("Nous n'avons pas de prévisions pour cette ville");
                }
                else{
                updateGlobalInfos(forecast);
                updateTodayWeather(forecast);
                updateNextDays(forecast);
                }
            });
        });
    
}
