import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/app/router/RootLayout'
import { AboutPage } from '@/features/about'
import { HomePage } from '@/features/home/HomePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'sobre',
        element: <AboutPage />,
      },
    ],
  },
])
