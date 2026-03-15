import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Events from './pages/Events'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evenements" element={<Events />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
