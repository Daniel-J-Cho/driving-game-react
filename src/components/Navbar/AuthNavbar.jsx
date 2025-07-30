import { useAppContext } from '../../lib/app-context.js';
import './Navbar.css'

const AuthNavbar = ({ headerName, SignInRegButton }) => {
    const { handleSignIn } = useAppContext();

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
            <div className='links'>
                <a href='#' className='account-link'>Exit</a>
                <a href={link} className='account-link'>{linkLabel}</a>
                <a onClick={handleGuestSignIn} className='account-link guest-link-button'>Sign in<br />as Guest</a>
            </div>
        </nav>
    )
};

export default AuthNavbar;
