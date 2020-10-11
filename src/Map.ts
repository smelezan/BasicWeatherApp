import * as L from 'leaflet';
const urlApi = "https://api-adresse.data.gouv.fr/reverse/?"

export class Map {

    map:L.Map;
    currentPoint:MapResponse|undefined;
    theMarker:L.Marker;

    constructor(map:L.Map){
        this.map = map;
        this.currentPoint=undefined;
        this.theMarker=L.marker([44.8167,-0.6]);
        // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // }).addTo( this.map);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21lbGV6YW4iLCJhIjoiY2tnMXlqd25yMDR0cTMwb2NqdjRuMWVqciJ9.fZ-WBYsNfyCigiJcBvUdUw', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: "pk.eyJ1Ijoic21lbGV6YW4iLCJhIjoiY2tnMXlqd25yMDR0cTMwb2NqdjRuMWVqciJ9.fZ-WBYsNfyCigiJcBvUdUw"
        }).addTo(this.map);
    }




    onMapClick(e:L.LocationEvent):Promise<string> { 
        return this.getCityNameFromCoordinates(e.latlng.lng, e.latlng.lat)
        .then(res=>{
            if(res.features.length >0){
                this.map.removeLayer(this.theMarker);
                this.theMarker= L.marker([e.latlng.lat, e.latlng.lng]).addTo( this.map)
                .bindPopup(`ville: ${res.features[0].properties.city}, code postal:${res.features[0].properties.postcode}`)
                .openPopup();
                return res.features[0].properties.city;
            }
            return "";
        })


        
        
        
    }


    getCityNameFromCoordinates(longitude:number,latitude:number):Promise<MapResponse>{

        return fetch(urlApi+`lat=${latitude}&lon=${longitude}`)
                .then(res =>{
                    return res.json()
                })
                .then(res=> {
                    this.currentPoint = res as MapResponse;
                    return this.currentPoint;
                });   


    }






}




interface MapResponse{
    features:Features[]
}

interface Features{
    properties: {
        postcode:string,
        city: string
    }
}