import { useState, useEffect } from 'react';
import './App.css';
import parseRoute from './lib/parse-route.js';
import { AppContext } from './lib/app-context.js';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import PlayHome from './pages/PlayHome.jsx';
import PlayMain from './pages/PlayMain.jsx';

const App = () => {
  const [route, setRoute] = useState(parseRoute(window.location.hash));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseRoute(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  const handleSignIn = result => {
    const { user, token } = result;
    window.localStorage.setItem('driving-game-jwt', token)
    setUser(user)
  }

  const renderPage = () => {
    if (route.path === '') return <Home />
    if (route.path === 'sign-in' || route.path === 'register') return <Auth />
    if (route.path === 'play-home') return <PlayHome />
    if (route.path === 'play-main') return <PlayMain />
  }

  const contextValue = {
    user,
    route,
    handleSignIn
  }

  return (
    <AppContext.Provider value={contextValue}>
      {renderPage()}
    </AppContext.Provider>
  )
}

export default App
