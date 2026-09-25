import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/app/router/RootLayout'
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
    ],
  },
])
