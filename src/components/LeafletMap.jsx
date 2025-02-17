import {
  LayersControl,
  MapContainer,
  TileLayer,
  useMap,
  GeoJSON,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { useMemo, useRef } from "react";
import { useEffect } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { BASEMAPS } from "../utils/constants";


import L from "leaflet";

import parse from 'html-react-parser'
import { idField } from "./SampleContainer";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
    iconUrl: require('leaflet/dist/images/marker-icon.png').default,
    shadowUrl: require('leaflet/dist/images/marker-shadow.png').default
});

const defaultBaseMap = "Google Maps";

export let map = null;
export let layerControlRef = null;
export let tileOverlays = [];
export let geojsonLayer = null;
export const setGeojsonLayer = (layer) => geojsonLayer = layer

export const addTileOverlays = (overlays) => {
  if (map && layerControlRef.current) {
    overlays.forEach((overlay) => {
      overlay.layer.addTo(map);
      layerControlRef.current.addOverlay(overlay.layer, overlay.name);
      tileOverlays.push(overlay.layer);
    });
  }
};

export const addGeoJsonOverlay = () => {
  if (geojsonLayer && map && layerControlRef.current) {
    geojsonLayer.addTo(map);
    layerControlRef.current.addOverlay(geojsonLayer, "samples")
  }
}

export const removeAllOverlays = (state) => {
  tileOverlays.forEach((layer) => {
    layerControlRef.current.removeLayer(layer);
    map.removeLayer(layer);
  });
};

export const panToLatLng = ([lat, lng]) => {
  if (map) {
    map.panTo([lat, lng]);
  }
};


export function Map(props) {

  const appName = useSelector(state => state.appName)

  const lcRef = useRef();

  const sampleState = useSelector(state => state.samples)

  useEffect(() => {
    layerControlRef = lcRef;
    setTimeout(() => {
      addTileOverlays(tileOverlays)
      addGeoJsonOverlay()
    }, 400)
    
  }, []);


  useEffect(() => {
    if (sampleState.selected) {

      let selected_sample = sampleState.geojson.features.filter(f => f.properties[idField] === sampleState.selected)[0]
      let latlon = [...selected_sample.geometry.coordinates].reverse()
      panToLatLng(latlon)

    }
  }, [sampleState.selected])

  useEffect(()=>{
    if (map) {
      map.invalidateSize();
    }
  },[appName])



  return (
    <MapContainer
      center={[11.1271, 78.6569]}
      zoom={7}
      id="map"
      whenCreated={(m) => {
        map = m;
      }}
    >
      <LayersControl ref={lcRef}>
        {Object.entries(BASEMAPS).map(([name, basemap]) => (
          <LayersControl.BaseLayer
            name={name}
            checked={name === defaultBaseMap}
            key={name}
          >
            <TileLayer url={basemap.url} attribution={basemap.attribution} />
          </LayersControl.BaseLayer>
        ))}

      </LayersControl>

    </MapContainer>
  );
}






export default Map;
