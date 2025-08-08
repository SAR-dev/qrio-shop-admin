import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NotificationProvider } from './contexts/NotificationContext.tsx'
import { PocketProvider } from './contexts/PocketContext.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import './styles/tailwind.css'
import './styles/custom.css'
import Signin from './pages/Signin.tsx'
import Home from './pages/Home.tsx'
import CreateProduct from './pages/CreateProduct.tsx'
import ViewProducts from './pages/ViewProducts.tsx'
import EditProduct from './pages/EditProduct.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <Signin />,
  },
  {
    path: "/products",
    element: <ViewProducts />,
  },
  {
    path: "/products/create",
    element: <CreateProduct />,
  },
  {
    path: "/products/:id",
    element: <EditProduct />,
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
