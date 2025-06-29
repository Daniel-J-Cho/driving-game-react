import './Navbar.css'

const Navbar = () => {
    return (
        <nav className='nav-element'>
            <span className='main-header'><strong>SPEEDING SHMEADING</strong></span>
            <div className='links'>
                <a href='#sign-in' className='account-link'>Sign In</a>
                <a href='#register' className='account-link'>Create Account</a>
            </div>
        </nav>
    )
};

export default Navbar