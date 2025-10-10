import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './errorBoundary.jsx'
import UiContextProvider from './context/uiContextProvider.jsx'
import ContextProvider from './context/contextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <UiContextProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    </UiContextProvider>
  </ContextProvider>
  </React.StrictMode>
)
