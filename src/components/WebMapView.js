import React, { Component, useEffect, useRef, useState } from 'react';
import {Button} from './Button';
import { loadModules } from 'esri-loader';
import './WebMapView.css';

export const WebMapView = () => {
    const mapRef = useRef();
    const [basemap, setBasemap] = useState('streets');

    useEffect(
      () => {
        loadModules(['esri/Map', 'esri/views/MapView'], { css: true })
        .then(([Map, MapView]) => {
          const map = new Map({
            basemap: `${basemap}`
          });

          const view = new MapView({
            container: mapRef.current,
            map: map,
            center: [-118, 34],
            zoom: 8
          });

          return () => {
            if (view) {
              // destroy the map view
              view.container = null;
            }
          };
        });
      }
    );

    let changeBasemap = () => {
      if (basemap == 'streets') {
        setBasemap('topo-vector')
      } else {
        setBasemap('streets')
      }

    }

    return (
      <>
        <div className="ümbris">
          <div className="webmap" ref={mapRef}></div>
          <Button changeBasemap={changeBasemap}/>
        </div>
      </>
    )
}
