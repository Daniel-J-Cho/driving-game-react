import { useState } from 'react';
import { useAppContext } from '../../lib/app-context.js';
import './Navbar.css'

const AuthNavbar = ({ headerName, SignInRegButton }) => {
    const { handleSignIn } = useAppContext();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }


    const link = SignInRegButton === 'register' 
        ? '#sign-in'
        : '#register'

    const linkLabel = SignInRegButton === 'register'
        ? 'Sign in'
        : 'Register'

    const handleGuestSignIn = async () => {
        try {
            const response = await fetch('/api/users/guest-sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.error || 'Failed to sign in as guest');
            }

            const result = await response.json();
            handleSignIn(result);
        } catch (error) {
            console.error('Guest sign-in error', error);
            alert('Could not sign in as guest. Please try again later.');
        }
    }

    return (
        <nav className='nav-element'>
            <span className='main-header'><strong>{headerName}</strong></span>
            <div className='right-section'>
                <button 
                    type='button' 
                    className={`signed-out-hamburger-icon ${isMenuOpen ? 'is-active' : ''}`} 
                    onClick={toggleMenu}
                >
                    <span className='line line-1'></span>
                    <span className='line line-2'></span>
                    <span className='line line-3'></span>
                </button>
                <div className='desktop-links'>
                    <a href='#' className='account-link'>Exit</a>
                    <a href={link} className='account-link'>{linkLabel}</a>
                    <a onClick={handleGuestSignIn} className='guest-link-button'>Sign in<br />as Guest</a>
                </div>
            </div>
                
            <div className={`signed-out-menu ${isMenuOpen ? 'is-open' : ''}`}>
                <a href='#' className='signed-out-menu-link'>Exit</a>
                <a href={link} className='signed-out-menu-link'>{linkLabel}</a>
                <a onClick={handleGuestSignIn} className='signed-out-menu-link'>Sign in<br />as Guest</a>
            </div>
        </nav>
    )
};

export default AuthNavbar;
