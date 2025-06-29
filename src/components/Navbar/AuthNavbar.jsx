import './Navbar.css'

const AuthNavbar = () => {
    return (
        <nav className='nav-element'>
            <span className='main-header'><strong>SPEEDING SHMEADING</strong></span>
            <div className='links'>
                <a href='#' className='account-link'>Take me home</a>
                <a href='#play' className='account-link'>Sign in as Guest</a>
            </div>
        </nav>
    )
};

export default AuthNavbar