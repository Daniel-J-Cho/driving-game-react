import * as React from 'react'
import AuthNavbar from '../components/Navbar/AuthNavbar';
import Redirect from '../components/Redirect.jsx';
import { useAppContext } from '../lib/app-context.js';
import AuthForm from '../components/AuthForm/AuthForm';

const Auth = () => {
    const { user, route, handleSignIn } = useAppContext();
    if (user) {
        return <Redirect to='#play-home' />
    }

    const toggleHeader = route.path === 'register'
        ? 'REGISTER'
        : 'SIGN IN'

    return (
        <div className='auth-page-container'>
            <AuthNavbar headerName={toggleHeader} SignInRegButton={route.path}/>
            <div className='auth-form-container'>
                <AuthForm
                    key={route.path}
                    action={route.path}
                    onSignIn={handleSignIn}
                />
            </div>
        </div>
    )
}

export default Auth;
