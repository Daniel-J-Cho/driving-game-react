import { useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import parseRoute from './lib/parse-route.js';
import { AppContext } from './lib/app-context.js';
import Home from './pages/Home.jsx';
import Auth from './pages/Auth.jsx';
import PlayHome from './pages/PlayHome.jsx';
import PlayMain from './pages/PlayMain.jsx';
import Delete from './pages/Delete.jsx';
import './App.css';

const App = () => {
  const [route, setRoute] = useState(parseRoute(window.location.hash));
  const [user, setUser] = useState(null);
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  const initialAuthChecked = useRef(false);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseRoute(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);

    if (!initialAuthChecked.current) {
      const token = window.localStorage.getItem('driving-game-jwt');
      const decodedUser = token ? jwtDecode(token) : null;
      setUser(decodedUser);
      setIsAuthorizing(false);
      
      if (decodedUser && (route.path === '' || route.path === 'sign-in' || route.path === 'register')) {
        window.location.hash = '#play-home';
      }
      initialAuthChecked.current = true;
    };

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignIn = result => {
    const { user, token } = result;
    window.localStorage.setItem('driving-game-jwt', token)
    setUser(user)
    window.location.hash = '#play-home';
  }

  const handleSignOut = () => {
    window.localStorage.removeItem('driving-game-jwt');
    setUser(null);
    window.location.hash= '';
  }

  const renderPage = () => {
    if (route.path === '') return <Home />
    if (route.path === 'sign-in' || route.path === 'register') return <Auth />
    if (route.path === 'play-home') return <PlayHome />
    if (route.path === 'play-main') return <PlayMain />
    if (route.path === 'delete-account') return <Delete />
  }

  const contextValue = {
    user,
    route,
    handleSignIn,
    handleSignOut
  };

  if (isAuthorizing) {
    return null;
  }

  return (
    <AppContext.Provider value={contextValue}>
      {renderPage()}
    </AppContext.Provider>
  )
}

export default App
