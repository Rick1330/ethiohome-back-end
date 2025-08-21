import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// MSW Function to enable mocking based on environment variable
async function enableMocking() {
  // Use the VITE_USE_MOCKS flag to conditionally enable mocking
  // This allows easy switching between the mock and real API
  if (import.meta.env.VITE_USE_MOCKS !== 'true') {
    return
  }

  const { worker } = await import('./mocks/browser')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  console.log('MSW enabled.');
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

// Call the function and then render the app
enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
