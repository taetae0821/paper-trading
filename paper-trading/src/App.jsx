import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import './App.css'
import Signup from './signup'
import Login from './login'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
