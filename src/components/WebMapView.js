import React, { Component, useEffect, useRef, useState } from 'react';
import {Button} from './Button';
import { loadModules } from 'esri-loader';
import './WebMapView.css';

export const WebMapView = () => {
    const mapRef = useRef();
    const [basemap, setBasemap] = useState('Hallkaart');

    useEffect(
      () => {
        loadModules(['esri/Map', 'esri/Basemap', 'esri/layers/WMSLayer', 'esri/views/MapView'], { css: true })
        .then(([Map, Basemap, WMSLayer, MapView]) => {
          var Orto = new WMSLayer ({
            url: "https://kaart.maaamet.ee/wms/fotokaart?service=WMS&version=1.3.0&request=GetCapabilities",
            title: "Ortofoto",
            listMode: "hide-children",
            visible: true,
            opacity: 0.7,
            sublayers: [{
              name: "EESTIFOTO"
            }]
          });

          var Hallkaart = new WMSLayer ({
            url: "https://kaart.maaamet.ee/wms/hallkaart?service=WMS&version=1.3.0&request=GetCapabilities",
            title: "Maa-ameti Hallkaart",
            listMode: "hide-children",
            visible: true
          });

          var Aluskaart = new Basemap({
            baseLayers: [eval(basemap)],
            title: "Aluskaart"
          });

          const map = new Map({
            basemap: Aluskaart
          });

          const view = new MapView({
            container: mapRef.current,
            map: map,
            spatialReference: {
              wkid: 3301
            },
            scale: 10000,
            /*extent: {
              xmin: 6617000,
              ymin: 375500,
              xmax: 6378500,
              ymax: 737000,
              spatialReference: 3301
            },*/
            center: {
              y: 6443466.43,
              x: 697004.90,
              spatialReference: 3301
            }
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
      if (basemap == 'Orto') {
        setBasemap('Hallkaart')
      } else {
        setBasemap('Orto')
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
