import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Envolvemos la aplicación con nuestra llave */}
    <GoogleOAuthProvider clientId="543150877659-0ta3446oi5lm3vbbqa1trga13occu2ht.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)