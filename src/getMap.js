import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function GetMap() {
  const mapRef = useRef(null);
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
      
      const layersObj = newMapLayers.reduce((acc, cur) => ({ ...acc, [cur.options.layers]: cur }), {});
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
  
  const handleVisibilityToggle = () => {
    setLayerVisibility(!layerVisibility);
    mapLayers.forEach((layer) => {
      layer.setParams({ visible: !layerVisibility });
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
                  if (index % 3 === 0) rows.push([]);
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


