import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function GetMap() {
  const  mapRef = useRef(null);//used to
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [layerNames, setLayerNames] = useState([]);
  const [mapLayers, setMapLayers] = useState([]);
  const [layerOpacity, setLayerOpacity] = useState(1);
  const [layerVisibility, setLayerVisibility] = useState(true);
  const [layerOrderAscending, setLayerOrderAscending] = useState(true);

  useEffect(() => {
    axios
      .get("https://nrt.cmems-du.eu/thredds/wms/global-analysis-forecast-bio-001-028-monthly?request=GetCapabilities&service=WMS")
      .then((response) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, "text/xml");
        const layerElements = xml.querySelectorAll("Layer > Name");
        const layerNames = Array.from(layerElements).map((el) => el.textContent);
        setLayerNames(layerNames);
      })
      .catch((error) => console.error(error));
  }, []);

  // const numbers = [1 , 2, 4 ,5];
  // const sum = numbers.reduce((accumulator, currentValue) => {
  //     return accumulator + currentValue;
  // },0);
  // console.log(sum);

  useEffect(() => {
    if (selectedLayers.length > 0) {
      const map = L.map(mapRef.current).setView([0, 0], 2);
      const baseMap = L.tileLayer("https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=9tNnV0KF3YnwnaJi5YkA", {
        attribution: "&copy; MapTiler",
        tileSize: 512,
        zoomOffset: -1,
      });
      baseMap.addTo(map);
      const newMapLayers = selectedLayers.map((layerName) => {
      const newMapLayer = L.tileLayer.wms("https://nrt.cmems-du.eu/thredds/wms/global-analysis-forecast-bio-001-028-monthly?", {
          layers: layerName,
          opacity: layerOpacity,
          visible: layerVisibility,
        });
        return newMapLayer;
      
      });
      const sortedMapLayers = layerOrderAscending ? newMapLayers : newMapLayers.reverse();

      // The const layersObj line creates an object that maps each overlay layer's name to its
      //  corresponding L.tileLayer object in the newMapLayers array. The reduce method is used 
      //  to loop over the array of layers and create an object where the key is the layer name 
      //  (obtained from the options.layers property) and the value is the layer object itself. 
      //  The ...acc syntax spreads the previous accumulator object into the new object, and 
      //  [cur.options.layers]: cur adds a new property with the current layer name as the key 
      //  and the current layer object as the value.
      // The const layerControl line creates a new L.control.layers object, which is a Leaflet 
      // control that allows the user to switch between different map layers. The first argument 
      // to this constructor is an object that maps each base layer's name to its corresponding 
      // L.tileLayer object. In this case, there is only one base layer, baseMap.
      // The second argument is the layersObj object that maps each overlay layer's name to its 
      // corresponding L.tileLayer object, as created by the reduce method. This object is used 
      // to display the overlay layers in the layer control.
      //  Finally, the setMapLayers line updates the state of the component with the 
      //  new newMapLayers array, which contains both the base map and overlay layers. 
      //  This allows the component to re-render with the updated layers displayed on the map.

     

      const layersObj = newMapLayers.reduce((acc, cur) => ({ ...acc, [cur.options.layers]: cur }), {baseMap});
      const layerControl = L.control.layers(
        {
          "Base Map": baseMap,
        },
        layersObj
      ).addTo(map);
      setMapLayers(newMapLayers);
      return () => {
        map.remove();
      };
    }
  }, [selectedLayers, layerOpacity, layerVisibility,layerOrderAscending]);

  const handleLayerSelect = (event) => {
    const layerName = event.target.id;
    if (selectedLayers.includes(layerName)) {
      setSelectedLayers(selectedLayers.filter((l) => l !== layerName));
    } else {
      setSelectedLayers([...selectedLayers, layerName]);
    }
  };
  
  const handleOpacityChange = (event) => {
    setLayerOpacity(parseFloat(event.target.value));
    mapLayers.forEach((layer) => {
      layer.setOpacity(parseFloat(event.target.value));
    });
  };
// This code defines a function called handleOpacityChange, which takes an event object as 
// its parameter.The function then sets the layer opacity value to a parsed float value of event.
// target.value using the setLayerOpacity function. The parseFloat() function is used to convert 
// the value from a string to a floating-point number.After that, the function iterates over each 
// layer in the mapLayers array using the forEach() method and sets the opacity of each layer to the
// same value using the setOpacity() method.Overall, this code appears to be used for handling 
// changes in the opacity of multiple layers in a map. It updates both the state of the layer
//  opacity as well as the opacity of each layer in the mapLayers array to reflect the user's
//   input.
  
  const handleVisibilityToggle = () => {
    setLayerVisibility(!layerVisibility);
    mapLayers.forEach((layer) => {
      layer.setParams({ visible: true });
    });
  };
  const handleLayerOrderChange = () => {
    setLayerOrderAscending(!layerOrderAscending);
  };

  return (
    <Container className="container">
    <Button variant="primary" className="my-4" onClick={handleLayerOrderChange}>
          {layerOrderAscending ? "Sort Descending" : "Sort Ascending"}
        </Button>
      <Form.Group controlId="layer-opacity">
        <Form.Label>Layer Opacity:</Form.Label>
        <p></p>
        <Form.Control type="range" min="0" max="1" step="0.1" value={layerOpacity} onChange={handleOpacityChange} />
      </Form.Group>
      <p></p>
      <Button variant="primary" onClick={() => {setLayerOpacity(1)}}>
        Reset Opacity
      </Button>
      <p></p>
      <Button variant="secondary" onClick={() => {
      mapLayers.forEach((layer) => {
      if (layer.getContainer().style.display === "none") {
      layer.getContainer().style.display = "block";
      } else {
      layer.getContainer().style.display = "none";
      }
      });
      }}>
      Toggle Visibility
      </Button>
      <p></p>
        <Row>
          <Col xs={12} md={6}>
            <h1 className="mb-4">Select Layers Image :</h1>
            <table>
              <tbody>
                {layerNames.reduce((rows, layerName, index) => {
                  if (index % 6 === 0) rows.push([]);
                  rows[rows.length - 1].push(
                    <td key={layerName}>
                      <Form.Check
                        type="checkbox"
                        id={layerName}
                        label={layerName}
                        onChange={handleLayerSelect}
                        checked={selectedLayers.includes(layerName)}
                      />
                    </td>
                  );
                  return rows;
                }, [])
                .map((row, index) => <tr key={index}>{row}</tr>)}
              </tbody>
            </table>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div ref={mapRef} className="leaflet-container" style={{ height: "50vh", width: "100%" }}></div>
          </Col>
        </Row>
      </Container>
    );
              
  }    
  export default GetMap;


