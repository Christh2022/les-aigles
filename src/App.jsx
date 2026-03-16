import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Events from './pages/Events'
import Missions from './pages/Missions'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import Formations from './pages/Formations'
import FormationDetail from './pages/FormationDetail'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import './App.css'

const ADMIN_PATH = '/acces-prive-lfae-7mQ2x9Kp4Vn8Rt3Yh6Zs1Jd5Wc0bL2t9/admin'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/evenements" element={<Events />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/formations/:id" element={<FormationDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path={ADMIN_PATH} element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
