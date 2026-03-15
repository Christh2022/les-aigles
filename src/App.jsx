import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Events from './pages/Events'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/evenements" element={<Events />} />
            {/* TODO: Ajouter les autres routes */}
            <Route path="/missions" element={<div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold">Page Missions - En construction</h1></div>} />
            <Route path="/formations" element={<div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold">Page Formations - En construction</h1></div>} />
            <Route path="/blog" element={<div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold">Page Blog - En construction</h1></div>} />
            <Route path="/contact" element={<div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold">Page Contact - En construction</h1></div>} />
            <Route path="/don" element={<div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold">Page Dons - En construction</h1></div>} />
            <Route path="/admin" element={<div className="container-custom py-20 text-center"><h1 className="text-3xl font-bold">Dashboard Admin - En construction</h1></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
