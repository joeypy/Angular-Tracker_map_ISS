import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as L from 'leaflet';
const issIcon = L.icon({
  iconUrl: '/assets/iss200.png',
  iconSize: [60, 38],
  iconAnchor: [25, 16],
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{

  // Vatiables de leaflet
  map;
  marker;
  tiles;
  seguir = false;
  textSeguir = 'Seguir a ISS';

  // Variables de la API
  response;
  apiUrl = 'https://api.wheretheiss.at/v1/satellites/25544';
  latitude = 0;
  longitude = 0;
  altitude = 0;
  velocity = 0;

  constructor( public http: HttpClient){
  }

  ngAfterViewInit() {
    this.initMap();
    setInterval( () => {
      this.getISS();
    }, 1000);
  }
  initMap() {
    this.map = L.map('mapId', {
      center: [ 0, 0 ],
      zoom: 2
    });
    this.marker = L.marker([ 0, 0 ], { icon: issIcon }).addTo(this.map);
    this.tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 2,
      attribution:
        'Make by <a target="_blank" href="http://jb.designio.tech">Joseph Boscán</a> in Angular | &copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    this.tiles.addTo(this.map);
  }

  getISS() {
    this.http.get( this.apiUrl ).subscribe( data => {
        this.response = data;
        const { latitude, longitude, altitude, velocity } = this.response;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.velocity = velocity;
        this.marker.setLatLng({ lat: this.latitude, lng: this.longitude});
        if(this.seguir){
          this.map.flyTo(new L.LatLng(this.latitude, this.longitude), 5);
        }
    });
  }

  seguimiento(){
    this.seguir = !this.seguir;
    if(this.seguir){
      this.textSeguir = 'Dejar de Seguir';
    }else {
      this.textSeguir = 'Seguir a ISS';
    }
  }



}
