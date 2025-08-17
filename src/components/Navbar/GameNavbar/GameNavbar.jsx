import { useState } from 'react';
import { useAppContext } from '../../../lib/app-context.js';
import './GameNavbar.css'

const GameNavbar = ({ headerName }) => {
    const { user, handleSignOut, route } = useAppContext();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    let message = ''

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    if (user) {
        message = `🏁 Welcome ${user.username}! 🏁`;
    }

    const onDeletePage = route.path === 'delete-account';
    const isGuest = user && user.username === 'Guest';

    return (
        <nav className='nav-element'>
            <div className='main-header'>
                <span className='header-text'>
                    <strong>{headerName}</strong>
                </span>
            </div>
            <div className='right-section'>
                <button 
                    type='button' 
                    className={`signed-in-hamburger-icon ${isMenuOpen ? 'is-active' : ''}`} 
                    onClick={toggleMenu}
                >
                    <span className='line line-1'></span>
                    <span className='line line-2'></span>
                    <span className='line line-3'></span>
                </button>
            </div>

            <div className={`signed-in-menu ${isMenuOpen ? 'is-open' : ''}`}>
                {onDeletePage ? 
                    <>
                        <a href='#' className='signed-in-menu-link' onClick={handleSignOut}>Sign out</a>
                        <a href='#game-home' className='signed-in-menu-link'>Cancel</a>
                    </> :
                    <>
                        <div className='welcome-message'>
                            <span>{message}</span>
                        </div>
                        <a href='#' className='signed-in-menu-link' onClick={handleSignOut}>Sign out</a>
                        {/* Conditionally render the 'Delete account' link for non-guest users */}
                        {!isGuest && (
                            <a href='#delete-account' className='signed-in-menu-link'>Delete account</a>
                        )}
                    </>
                }
            </div>
        </nav>
    )
};

export default GameNavbar
