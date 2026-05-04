import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { MCUProvider } from './context/MCUContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MCUProvider>
        <App />
      </MCUProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
