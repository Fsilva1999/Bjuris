import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">BJuris</h1>
        <p className="text-xl text-gray-400">Escritório Jurídico Digital para Advocacia Previdenciária</p>
        <p className="mt-4 text-gray-500">Sistema em desenvolvimento...</p>
      </div>
    </div>
  )
}