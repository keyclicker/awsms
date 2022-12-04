import 'bootstrap-icons/font/bootstrap-icons.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import App from './App'
import './index.scss'
import SearchPage from './pages/search'
import reportWebVitals from './reportWebVitals'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/*' element={<App />} errorElement={<div>Error 404</div>}>
      <Route index element={<Navigate to='/search' />} />
      <Route path='search/' element={<SearchPage />} />
    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
