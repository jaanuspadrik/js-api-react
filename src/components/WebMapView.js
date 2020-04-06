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
        const api_call = await fetch(`http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${aadress}%22Tartu%22vald&f=json&outSR=%7B%22wkid%22%3A3301%7D&outFields=Addr_type&countryCode=EST`);
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
        loadModules(['esri/Map', 'esri/Basemap', 'esri/layers/WMSLayer', 'esri/layers/FeatureLayer', 'esri/layers/MapImageLayer', 'esri/views/MapView', 'esri/Graphic'], { css: true })
        .then(([Map, Basemap, WMSLayer, FeatureLayer, MapImageLayer, MapView, Graphic]) => {
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
            },
            popup: {
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
            }
          });
          var MaakasutusKaardile = new MapImageLayer({
            url: "https://maps.hendrikson.ee/arcgis/rest/services/Tartu_vald/Tartu_vald_eskiis/MapServer",
            title: "Kavandatav maakasutus",
            opacity: 0.8,
            sublayers: [
            {
              id: 45,
              popupEnabled: false,
              title: "Sadama maa-ala (LS)",
              popupTemplate: {
                title: "Sadama maa-ala (LS)"
              }
            },
            {
              id: 44,
              popupEnabled: false,
              title: "Kaubandus-, teenindus- ja büroohoonete ning tootmise- ja logistikakeskuse maa-ala (ÄT)",
              popupTemplate: {
                title: "Kaubandus-, teenindus- ja büroohoonete ning tootmise- ja logistikakeskuse maa-ala (ÄT)"
              }
            },
            {
              id: 43,
              popupEnabled: false,
              title: "Korterelamu maa-ala (EK)",
              popupTemplate: {
                title: "Korterelamu maa-ala (EK)"
              }
            },
            {
              id: 42,
              popupEnabled: false,
              title: "Väikeelamu maa-ala (EV)",
              popupTemplate: {
                title: "Väikeelamu maa-ala (EV)"
              }
            },
            {
              id: 41,
              popupEnabled: false,
              title: "Supelranna maa-ala (PR)",
              popupTemplate: {
                title: "Supelranna maa-ala (PR)"
              }
            },
            {
              id: 40,
              popupEnabled: false,
              title: "Riigikaitse maa-ala (RR)",
              popupTemplate: {
                title: "Riigikaitse maa-ala (RR)"
              }
            },
            {
              id: 39,
              popupEnabled: false,
              title: "Ühiskondliku hoone maa-ala (AA)",
              popupTemplate: {
                title: "Ühiskondliku hoone maa-ala (AA)"
              }
            },
            {
              id: 38,
              popupEnabled: false,
              title: "Kaubandus-, teenindus- ja büroohoone maa-ala (Ä)",
              popupTemplate: {
                title: "Kaubandus-, teenindus- ja büroohoone maa-ala (Ä)"
              }
            },
            {
              id: 37,
              popupEnabled: false,
              title: "Keskuse maa-ala (C)",
              popupTemplate: {
                title: "Keskuse maa-ala (C)"
              }
            },
            {
              id: 36,
              popupEnabled: false,
              title: "Elamu- ning kaubandus-, teenindus- ja büroohoone maa-ala (E/Ä)",
              popupTemplate: {
                title: "Elamu- ning kaubandus-, teenindus- ja büroohoone maa-ala (E/Ä)"
              }
            },
            {
              id: 35,
              popupEnabled: false,
              title: "Tehnoehitise maa-ala (OT)",
              popupTemplate: {
                title: "Tehnoehitise maa-ala (OT)"
              }
            },
            {
              id: 34,
              popupEnabled: false,
              title: "Ühiskondliku hoone ning kaubandus-, teenindus- ja büroohoone maa-ala (AA/Ä)",
              popupTemplate: {
                title: "Ühiskondliku hoone ning kaubandus-, teenindus- ja büroohoone maa-ala (AA/Ä)"
              }
            },
            {
              id: 33,
              popupEnabled: false,
              title: "Lennuvälja maa-ala (LL)",
              popupTemplate: {
                title: "Lennuvälja maa-ala (LL)"
              }
            },
            {
              id: 32,
              popupEnabled: false,
              title: "Jäätmekäitluse maa-ala (OJ)",
              popupTemplate: {
                title: "Jäätmekäitluse maa-ala (OJ)"
              }
            },
            {
              id: 31,
              popupEnabled: false,
              title: "Aianduse maa-ala (AM)",
              popupTemplate: {
                title: "Aianduse maa-ala (AM)"
              }
            },
            {
              id: 30,
              popupEnabled: false,
              title: "Kalmistu maa-ala (K)",
              popupTemplate: {
                title: "Kalmistu maa-ala (K)"
              }
            },
            {
              id: 29,
              popupEnabled: false,
              title: "Kultuuri- ja spordiasutuse ning kaubandus-, teenindus- ja büroohoone maa-ala (ÜK/Ä)",
              popupTemplate: {
                title: "Kultuuri- ja spordiasutuse ning kaubandus-, teenindus- ja büroohoone maa-ala (ÜK/Ä)"
              }
            },
            {
              id: 28,
              popupEnabled: false,
              title: "Liikluse ja liiklust korraldava ehitise maa-ala (LT)",
              popupTemplate: {
                title: "Liikluse ja liiklust korraldava ehitise maa-ala (LT)"
              }
            },
            {
              id: 27,
              popupEnabled: false,
              title: "Haljasala (H)",
              popupTemplate: {
                title: "Haljasala (H)"
              }
            },
            {
              id: 26,
              popupEnabled: false,
              title: "Väikeelamu- ja ühiskondliku hoone maa-ala (EV/AA)",
              popupTemplate: {
                title: "Väikeelamu- ja ühiskondliku hoone maa-ala (EV/AA)"
              }
            },
            {
              id: 25,
              popupEnabled: false,
              title: "Kaubandus-, teenindus- ja büroohoone ning väikeelamu maa-ala (EV/Ä)",
              popupTemplate: {
                title: "Kaubandus-, teenindus- ja büroohoone ning väikeelamu maa-ala (EV/Ä)"
              }
            },
            {
              id: 24,
              popupEnabled: false,
              title: "Kaubandus-, teenindus- ja büroohoone ning korterelamu maa-ala (EK/Ä)",
              popupTemplate: {
                title: "Kaubandus-, teenindus- ja büroohoone ning korterelamu maa-ala (EK/Ä)"
              }
            }]
          });

          var MKTähised = new FeatureLayer({
            url: "https://maps.hendrikson.ee/arcgis/rest/services/Tartu_vald/Tartu_vald_MK_tähised/MapServer/0",
            title: "Maakasutuse tähised",
            legendEnabled: false,
            minScale: 20000,
            labelingInfo: {
              symbol: {
                type: "text",
                color: "black",
                haloColor: "white",
                haloSize: "1px",
                font: {
                  family: "Montserrat",
                  size: 8,
                  weight: "normal"
                }
              },
              labelPlacement: "center-center",
              labelExpressionInfo: {
                expression: "$feature.TextString"
              }
            },
            renderer: {
              type: "simple",
              symbol: {
                type: "simple-marker",
                color: "white",
                size: 0,
                outline: {
                  color: [0, 0, 0, 0.1],
                  width: 0.5
                }
              }
            }
          });

          function popupContent(feature) {
            let tulemus = leiaJuhtotstarve(feature.graphic.attributes.maakasutus);
            let tingimused = tulemus.tingimused;
            function makeUL(arr) {
              var list = document.createElement('ul');
              arr.forEach(tingimus => {
                  var item = document.createElement('li');
                  item.appendChild(document.createTextNode(tingimus.kirjeldus));
                  list.appendChild(item);
              });
              return list.outerHTML
            };
            return makeUL(tingimused)
          }
          function popupTitle(feature) {
            let tulemus = leiaJuhtotstarve(feature.graphic.attributes.maakasutus);
            return `Maakasutus: ${tulemus.juhtotstarve} (${tulemus.tähis})`
          }
          const Maakasutus = new FeatureLayer({
            url: "http://maps.hendrikson.ee/arcgis/rest/services/Hosted/Planeeritav_maakasutus_Tartu_vald_test/FeatureServer/0",
            visible: true,
            outFields: ["*"],
            opacity: 0,
            popupTemplate: {
              title: popupTitle,
              content: popupContent
            }
          });
          map.add(MaakasutusKaardile);
          map.add(MKTähised);
          map.add(Maakasutus);

          if (location.location) {
            let aadressiKomponendid = location.address.split(', ');
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
                type: "picture-marker",
                 url: "./pin.svg",
                 width: 38,
                 height: 28,
                 xoffset: 0,
                 yoffset: 10
              }
            });
            view.graphics.add(marker);
            view.goTo(marker, {duration: 700});

            const päring = Maakasutus.createQuery();
            päring.geometry = marker.geometry;
            Maakasutus.queryFeatures(päring).then(function(results){
              function popupContent() {
                if (results.features.length) {
                  let tulemus = leiaJuhtotstarve(results.features[0].attributes.maakasutus);
                  let tingimused = tulemus.tingimused;
                  function makeUL(arr) {
                    var list = document.createElement('ul');
                    arr.forEach(tingimus => {
                        var item = document.createElement('li');
                        item.appendChild(document.createTextNode(tingimus.kirjeldus));
                        list.appendChild(item);
                    });
                    return list.outerHTML
                  };
                  return `Maakasutus: ${tulemus.juhtotstarve} (${tulemus.tähis})` + makeUL(tingimused)
                } else {
                  return "Hajaasustusega ala<br>Tingimused on järgnevad:"
                }
              }


              view.popup = {
                title: aadressiKomponendid[0] + ", " + aadressiKomponendid[2],
                content: String(popupContent()),
                visible: true,
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
