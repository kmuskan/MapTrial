import React, { memo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";
import { GiPositionMarker } from 'react-icons/gi';
import { Spring, config } from "react-spring/renderprops";
import ReactTooltip from "react-tooltip";
import { geoPath } from "d3-geo"

const markers = [

  { color: "#085229", name: "Delhi", coordinates: [77.1193, 28.4897] },
  { color: "#085229", name: "Mumbai", coordinates: [72.8825, 19.7942] },
  { color: "#085229", name: "Chennai", coordinates: [80.2707, 13.0827] },
  { color: "#a14a45", name: "Kolkata", coordinates: [88.3639, 22.5726] }
];

const geoPathWorld =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const geoUrl = "/world.json";

const geoPaths = {
  IND: {
    countryISO_A3: "IND",
    center: [78.9629, 22.5937],
    color : "#389c66"
  },
  USA: {
    countryISO_A3: "USA",
    center: [-95.7129, 37.0902],
    color: "#389c66"
  },
  AUS: {
    countryISO_A3: "AUS",
    center: [133, -23],
    color: "#c4aa52"
  },
  FRA: {
    countryISO_A3: "FRA",
    center: [1.6, 47],
    color: "#389c66"
  }
}


const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const MapChart = ({ setTooltipContent }) => {

  const [detail, setDetail] = useState(false);
  const [paths, setPaths] = useState(geoPathWorld);
  const [center, setCenter] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);
  const [data, setData] = useState("")

  const switchPaths = (a, b) => {
    console.log(a);
    paths: detail ? setPaths(geoPathWorld) : setPaths("");
    center: detail ? setCenter([0, 0]) : setCenter(geoPaths[a].center);
    zoom: detail ? setZoom(1) : setZoom(5);
    detail: setDetail(!detail);
  };

  return (
  <div>
    <Spring
          from={{ zoom: 1 }}
          to={{ zoom: zoom }}
          config={config.slow}
        >

          {styles => (
          <ComposableMap style={{ height : 800, width : 1200}} data-tip=""  projection = "geoMercator" projectionConfig={{ scale: 120 }}>
            <ZoomableGroup center= {center} zoom={styles.zoom}>
              <Geographies geography={paths} disableOptimization>
                  {({ geographies }) =>
                    geographies.map((geo, i) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                          if(!detail){
                            const { NAME, POP_EST } = geo.properties;
                            setTooltipContent(`${NAME} — ${rounded(POP_EST)}`);
                          }
                        }}
                        onMouseLeave={() => {
                          setTooltipContent("");
                        }}
                        onClick={() => {
                          //const path = geoPath().projection(geo.projection())
                          //const centroid = geo.projection().invert(path.centroid(geo))
                          //switchPaths(geo.properties.ISO_A3, centroid );
                          if (geoPaths[geo.properties.ISO_A3]) {
                            switchPaths(geo.properties.ISO_A3);
                          }
                        }}
                        style={{
                          default: {
                            fill: geoPaths[geo.properties.ISO_A3] ? geoPaths[geo.properties.ISO_A3].color : "#889e92",
                            outline: "none",
                            stroke: "#5c8a5a",
                            strokeWidth : 0.5
                          },
                          hover: {
                            fill: geoPaths[geo.properties.ISO_A3] ? geoPaths[geo.properties.ISO_A3].color : "#889e92",
                            outline: "none",
                            stroke: "#5c8a5a",
                            strokeWidth : 0.5
                          },
                          pressed: {
                            fill: "#E42",
                            outline: "none"
                          }
                        }}
                      />
                    ))
                  }
              </Geographies>

              {markers.map(({ name, coordinates, color }) => (
                // <ReactTooltip>
                  <Marker key={name} coordinates={coordinates}  >
                  <GiPositionMarker size={3} color={color} x = {-1.5}
                    onMouseEnter={() => {
                      if(detail)
                        setData(`${name}`);
                    }}
                    onMouseLeave={() => {
                      debugger;
                      setData("");
                      console.log(data)
                    }}
                    data-tip={data} />
                     if(detail == true)
                  <ReactTooltip></ReactTooltip>
                  <text fontSize="3px" x = {-2} y = {5}>{name}</text>
                </Marker>

                ))}

              </ZoomableGroup>
          </ComposableMap>
          )}
        </Spring>
    </div>
  );
};

export default memo(MapChart);
