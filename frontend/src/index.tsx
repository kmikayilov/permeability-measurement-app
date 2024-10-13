import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';

import './assets/fonts/fontawesome.css';
import './assets/css/bootstrap.min.css';
import './assets/css/style.css';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();