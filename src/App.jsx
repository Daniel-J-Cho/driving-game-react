import { useState, useEffect } from 'react'
import './App.css'
import parseRoute from './lib/parse-route.js'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Play from './pages/Play.jsx'

const App = () => {
  const [route, setRoute] = useState(parseRoute(window.location.hash))

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseRoute(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  const renderPage = () => {
    if (route.path === '') return <Home />

    if (route.path === 'register' || route.path === 'sign-in') return <Auth />

    if (route.path === 'play') return <Play />
  }

  return (
    <div>
      {renderPage()}
    </div>
    
  )
}

export default App
