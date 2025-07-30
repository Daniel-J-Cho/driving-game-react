import { useState } from 'react';
import './AuthForm.css'

const AuthForm = ({ action, onSignIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = event => {
        const { name, value } = event.target;
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const reqBody = JSON.stringify({ username, password });
            
            const req = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: reqBody,
            };

            const response = await fetch(`/api/users/${action}`, req);
            const result = await response.json();

            if (!response.ok) {
                setMessage(result.error || 'Registration failed. Please try again.');
                return;
            }

            if (action === 'register') {
                window.location.hash = 'sign-in'
            } else if (result.user && result.token) {
                // onSignIn prop is passed from AuthForm component in Auth.jsx
                onSignIn(result);
            } else if (!result.user || !result.token) {
                setMessage('Invalid username and/or password. Please try again or Register.')
            } else {
                setMessage('An unexpected success occurred. Please sign in manually');
            }
        } catch (error) {
            console.error('Fetch error: ', error);
            setMessage('Network error. Could not connect to the server.');
        } finally {
            setIsLoading(false);
        }
    }

    const headerMessage = action === 'register'
        ? 'Register'
        : 'Sign In';
    
    const submitButtonText = action === 'register'
        ? 'Register'
        : 'Sign In';
    
    const placeholdUsernameText = action === 'register'
        ? 'Create a username'
        : 'Enter your username'

    const placeholdPasswordText = action === 'register'
        ? 'Create a password'
        : 'Enter your password'



    return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='bg-[#033500] p-8 mb-50 rounded-xl shadow-2xl w-full max-w-md border border-blue-700 animate-pulse-border'>
                    <h2 className='text-3xl font-bold mb-8 text-center text-gray-300'>
                        {headerMessage}
                    </h2>
                    
                    <form onSubmit={handleSubmit} className='space-y-8'>
                        <h2 className='text-2xl'>{isLoading ? 'Processing...' : ''}</h2>
                        {message && <p className='text-red-900'>{message}</p>}
                        <div>
                            <label
                                htmlFor='username'
                                className='block text-lg font-medium text-gray-100 mb-2'
                            >
                                Username
                            </label>
                            <input
                                type='text'
                                id='username'
                                name='username'
                                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out'
                                placeholder={placeholdUsernameText}
                                onChange={handleChange}
                                value={username}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='password'
                                className='block text-lg font-medium text-gray-100 mb-2'
                            >
                                Password
                            </label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-900 focus:border-blue-900 transition duration-150 ease-in-out'
                                placeholder={placeholdPasswordText}
                                onChange={handleChange}
                                value={password}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <button
                                type='submit'
                                className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 font-semibold'
                                disabled={isLoading}
                            >
                                {submitButtonText}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

    )
}

export default AuthForm;
