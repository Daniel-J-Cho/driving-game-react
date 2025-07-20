import { useAppContext } from '../../lib/app-context.js';
import './Navbar.css'

const PlayNavbar = () => {
    const { user } = useAppContext();

    let message = ''

    if (user) {
        message = `🏁 Welcome ${user.username}! 🏁`;
    }

    return (
        <nav className='nav-element'>
            <span className='main-header'><strong>SPEEDING SHMEADING</strong></span>
            <div className='links'>
                <span className='text-xl'>{message}</span>
                <a href='#' className='account-link'>Sign out</a>
            </div>
        </nav>
    )
};

export default PlayNavbar