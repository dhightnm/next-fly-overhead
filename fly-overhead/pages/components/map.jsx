import React, { useState } from "react"
import PlaneMarker from "./planesMarker";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import axios from 'axios'
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-defaulticon-compatibility"


const Map = (props) => {

  const [planes, setPlanes] = useState([]);
  //start process for geo location load on map render
  const [userPosition, setUserPosition] = useState(null)

  function MyComponent() {
    const map = useMapEvents({
      click: () => {
        map.locate();
        console.log(map.locate());
      },
      locationfound: (location) => {
        setUserPosition(location.latlng);
        map.flyTo(location.latlng, map.getZoom())
        console.log(userPosition);
        console.log('location found:', location)
      },
      moveend: async () => {
        const bounds = map.getBounds();
        const wrapBounds = map.wrapLatLngBounds(bounds);
        console.log(bounds);
        // console.log(wrapBounds._southWest.lat, wrapBounds._southWest.lng, wrapBounds._northEast.lat, wrapBounds._northEast.lng);

        const res = await axios.get(`https://${process.env.OPENSKY_USER}:${process.env.OPENSKY_PASS}@opensky-network.org/api/states/all?lamin=${wrapBounds._southWest.lat}&lomin=${wrapBounds._southWest.lng}&lamax=${wrapBounds._northEast.lat}&lomax=${wrapBounds._northEast.lng}`);
        // `http://localhost:3000/api/area/${wrapBounds._southWest.lat}/${wrapBounds._southWest.lng}/${wrapBounds._northEast.lat}/${wrapBounds._northEast.lng}`
        // const res = await axios.get(`http://localhost:3001/api/area/all`);
        console.log(res.data);
        setPlanes(res.data.states)
        
      },
    })
    return null;
  }

  const renderPlanes = () => {
     return planes.map((plane, i) => {
      if (plane[6] !== null) {
        return <PlaneMarker key={i} plane={plane}>
        </PlaneMarker>
      }
      return null;
    })
  };

    const position = [36.1087, -115.1796]
  return <>
  <MapContainer
    center={position} 
    zoom={13} 
    scrollWheelZoom={true}
    style={{height: 500, width: 500}}>
  <MyComponent />
  <TileLayer
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {renderPlanes()}
  </MapContainer>
  </>
};

export default Map;
