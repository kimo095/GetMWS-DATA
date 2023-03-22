import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import GetMap from './getMap';
import GetCapabilities from './GetCapabilities';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <GetCapabilities/>
   <GetMap/>
  </React.StrictMode>
);

reportWebVitals();
