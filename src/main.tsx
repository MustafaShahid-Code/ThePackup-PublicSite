import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import App from './App'
import { CmsProvider } from './cms/CmsContext'
import './index.css'

// The admin panel is code-split, so visitors never download it.
const Admin = lazy(() => import('./admin/Admin'))

function Root() {
  const { pathname } = useLocation()
  if (pathname === '/admin' || pathname.startsWith('/admin/'))
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    )
  return (
    <CmsProvider>
      <App />
    </CmsProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>,
)
