import './Navbar.css'

const AuthNavbar = ({ headerName, SignInRegButton }) => {
    const link = SignInRegButton === 'register' 
        ? '#sign-in'
        : '#register'

    const linkLabel = SignInRegButton === 'register'
        ? 'Sign in'
        : 'Register'

    return (
        <nav className='nav-element'>
            <span className='main-header'><strong>{headerName}</strong></span>
            <div className='links'>
                <a href='#' className='account-link'>Exit</a>
                <a href={link} className='account-link'>{linkLabel}</a>
                <a href='#play-home' className='account-link'>Sign in as Guest</a>
            </div>
        </nav>
    )
};

export default AuthNavbar;
