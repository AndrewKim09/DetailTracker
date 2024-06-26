import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import './styles/font.css'
import App from './App';
import { HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);