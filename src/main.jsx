import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {TigreProvider} from './context/TigreProvider';
import './index.css';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TigreProvider>
        <App />
      </TigreProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
