import React, { Component, useEffect, useRef, useState } from 'react';
import {Button} from './Button';
import {SearchForm} from './SearchForm';
import { loadModules } from 'esri-loader';
import Tingimused from '../Tingimused';
import './WebMapView.css';

export const WebMapView = () => {
    const mapRef = useRef();
    const [basemap, setBasemap] = useState('Hallkaart');
    const [location, setLocation] = useState({});
    const [tingimused, setTingimused] = useState(Tingimused);

    let getLocation = async (event) => {
      event.preventDefault();
      const aadress = event.target.elements.location.value;
      if (aadress) {
        const api_call = await fetch(`http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${aadress}&f=json&outSR=%7B%22wkid%22%3A3301%7D&outFields=Addr_type&countryCode=EST`);
        const data = await api_call.json();
        const asukoht = data.candidates[0];
        setLocation(asukoht);
        document.getElementById("valik").reset();
      }
    };

    let leiaJuhtotstarve = (tähis) => {
      return tingimused.find(function(juhtotstarve){
        return juhtotstarve.tähis === tähis
      })
    };

    useEffect(
      () => {
        console.log(location);
        loadModules(['esri/Map', 'esri/Basemap', 'esri/layers/WMSLayer', 'esri/layers/FeatureLayer', 'esri/views/MapView', 'esri/Graphic'], { css: true })
        .then(([Map, Basemap, WMSLayer, FeatureLayer, MapView, Graphic]) => {
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
            center: {
              y: 6479014.93,
              x: 661563.17,
              spatialReference: 3301
            }
          });
          const Maakasutus = new FeatureLayer({
            url: "http://maps.hendrikson.ee/arcgis/rest/services/Hosted/Planeeritav_maakasutus_Tartu_vald_test/FeatureServer/0",
            visible: false
          });
          map.add(Maakasutus);

          if (location.location) {
            const marker = new Graphic({
              attributes: {
                aadress: location.address
              },
              popupTemplate: {
                title: "{aadress}"
              },
              geometry: {
                type: "point",
                spatialReference: {
                  wkid: 3301
                },
                x: location.location.x,
                y: location.location.y
              },
              symbol: {
                type: "simple-marker",
                color: [226, 119, 40]
              }
            });
            view.graphics.add(marker);
            /*view.popup.location = {
              x: location.location.x,
              y: location.location.y,
              spatialReference: 3301
            };
            view.popup.features = [marker];*/
            view.goTo(marker, {duration: 700});
            view.when(function(){
              view.popup.visible = true
            })

            const päring = Maakasutus.createQuery();
            päring.geometry = marker.geometry;
            Maakasutus.queryFeatures(päring).then(function(results){
              let tulemus = leiaJuhtotstarve(results.features[0].attributes.maakasutus.tingimused);
              function makeUL(arr) {
                // Create the list element:
                var list = document.createElement('ul');
                arr.forEach(tingimus => {
                    // Create the list item:
                    var item = document.createElement('li');
                    // Set its contents:
                    item.appendChild(document.createTextNode(tingimus));
                    // Add it to the list:
                    list.appendChild(item);
                })
                // Finally, return the constructed list:
                return list;
              };
              console.log(makeUL(tulemus));
              view.popup = {
                title: "Maakasutus: ",
                content: "makeUL(tulemus)",
                actions: [],
                collapsed: false,
                dockEnabled: true,
                autoOpenEnabled: true,
                dockOptions: {
                  breakpoint: false,
                  buttonEnabled: false,
                  collapseEnabled: false,
                  position: "bottom-right"
                }
              };
              console.log(view.popup)
            });
          };

          return () => {
            if (view) {
              view.container = null;
            }
          };
        });
      }
    );

    let changeBasemap = () => {
      if (basemap === 'Orto') {
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
          <SearchForm
            getLocation={getLocation}
          />
        </div>
      </>
    )
}
