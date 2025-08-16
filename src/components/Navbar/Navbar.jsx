import { useState } from 'react';
import './Navbar.css'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <nav className='nav-element'>
            <span className='main-header'><strong>SPEEDING SHMEADING</strong></span>

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
                    <a href='#register' className='account-link'>Register</a>
                    <a href='#sign-in' className='account-link'>Sign In</a>
                </div>

                <div className={`signed-out-menu ${isMenuOpen ? 'is-open' : ''}`}>
                    <a href='#register' className='signed-out-menu-link'>Register</a>
                    <a href='#sign-in' className='signed-out-menu-link'>Sign In</a>
                </div>
            </div>
            
        </nav>
    )
};

export default Navbar
