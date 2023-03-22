import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function GetCapabilities() {
  const [layerNames, setLayerNames] = useState([]);
  const [layerAbstracts, setLayerAbstracts] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState('');
  const [legendUrl, setLegendUrl] = useState('');

  useEffect(() => {
    axios.get('https://nrt.cmems-du.eu/thredds/wms/global-analysis-forecast-bio-001-028-monthly?request=GetCapabilities&service=WMS')
      .then(response => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(response.data, 'text/xml');
        const layerElements = xml.querySelectorAll('Layer > Name');
        const layerNames = Array.from(layerElements).map(el => el.textContent);
        setLayerNames(layerNames);
        const layerElement = xml.querySelectorAll('Layer > Abstract');
        const layerAbstracts = Array.from(layerElement).map(el => el.textContent);
        setLayerAbstracts(layerAbstracts);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedLayer) {
      const url = `https://nrt.cmems-du.eu/thredds/wms/global-analysis-forecast-bio-001-028-monthly?request=GetLegendGraphic&layer=${selectedLayer}`;
      setLegendUrl(url);
    }
  }, [selectedLayer]);

  const handleLayerChange = event => {
    setSelectedLayer(event.target.value);
  };

  return (
    <div className="container">
    <p></p>
      <h1 className="mb-4">Get Layer Abstract & Legend </h1>
      <div className="form-group">
        <select id="layer-select" className="form-control" value={selectedLayer} onChange={handleLayerChange}>
          <option value=""> Select ( Layer name - Abstract )   </option>
          {layerNames.map((layerName, index) => (
            <option key={layerName} value={layerName}>
              {layerName} - {layerAbstracts[index]}
            </option>
          ))}
        </select>
      </div>
      <p></p>
      <h1> Layer Legend</h1>
      {legendUrl && (
        <img src={legendUrl} alt={`Legend graphic for ${selectedLayer}`} className="img-fluid mt-4" />
      )}
      <p></p>
    </div>
  );
}

export default GetCapabilities;
