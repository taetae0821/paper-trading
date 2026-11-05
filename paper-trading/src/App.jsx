import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './App.css'
import Signup from './signup'
import Login from './login'
import Layout from './layout'
import Market from './market'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/market" element={<Market />} />
          <Route path="/portfolio" element={<div />} />
          <Route path="/history" element={<div />} />
          <Route path="/ranking" element={<div />} />
          <Route path="/admin" element={<div />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
