import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function GetMap() {
  const mapRef = useRef(null);
  const [selectedLayer, setSelectedLayer] = useState('');
  const [layerNames, setLayerNames] = useState([]);
  const [mapLayer, setMapLayer] = useState(null);

 

  useEffect(() => {
    axios.get('https://nrt.cmems-du.eu/thredds/wms/global-analysis-forecast-bio-001-028-monthly?request=GetCapabilities&service=WMS')
      .then(response => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, 'text/xml');
        const layerElements = xml.querySelectorAll('Layer > Name');
        const layerNames = Array.from(layerElements).map(el => el.textContent);
        setLayerNames(layerNames);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedLayer) {
      const map = L.map(mapRef.current).setView([0, 0], 2);
      const baseMap = L.tileLayer(
        'https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=9tNnV0KF3YnwnaJi5YkA',
        {
          attribution: '&copy; MapTiler',
          tileSize: 512,
          zoomOffset:-1,
        }
      );
      baseMap.addTo(map);
      const newMapLayer = L.tileLayer.wms(
        'https://nrt.cmems-du.eu/thredds/wms/global-analysis-forecast-bio-001-028-monthly?',
        {
          layers: selectedLayer,
          opacity: layerOpacity,
          visibility: layerVisibility // include visibility option
        }
      );
      const layerControl = L.control.layers({
        'Base Map': baseMap,
      }, {
        [selectedLayer]: newMapLayer,
      }).addTo(map);
      setMapLayer(newMapLayer);
      return () => {
        map.remove();
      };
    }
  }, [selectedLayer, layerOpacity, layerVisibility]); // include layerVisibility in dependency array

  const handleLayerSelect = (event) => {
    setSelectedLayer(event.target.value);
  };


  return (
    <Container className="container">
      <Row>
        <Col xs={12} md={6}>
          <Form.Group controlId="layer-select">
            <h1 className="mb-4">Get Layer Image</h1>

    <Form.Control as="select" value={selectedLayer} onChange={handleLayerSelect}>
              <option value="">-- Please select your layer --</option>
              {layerNames.map(layerName => (
                <option key={layerName} value={layerName}>
                  {layerName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div ref={mapRef} className="leaflet-container" style={{ height: '50vh', width: '100%' }}></div>
        </Col>
      </Row>
    </Container>
  );
}

export default GetMap;


