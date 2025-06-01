import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.tsx'
import { NotificationProvider } from './contexts/NotificationContext.tsx'
import { PocketProvider } from './contexts/PocketContext.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Signin from './pages/Signin.tsx'
import './tailwind.css'
import './custom.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/sign-in",
    element: <Signin />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <PocketProvider>
        <RouterProvider router={router} />
      </PocketProvider>
    </NotificationProvider>
  </StrictMode>,
)
