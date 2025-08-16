import { useState } from 'react';
import '../AuthForm/AuthForm.css';

const DeleteForm = ({ onDeleteSuccess, user }) => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handlePasswordChange = event => {
        setPassword(event.target.value);
    };

    const handleConfirm = () => {
        setIsConfirmed(true);
    };

    const handleDelete = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const reqBody = JSON.stringify({ password });

            const req = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem('driving-game-jwt')}`
                },
                body: reqBody
            };

            const response = await fetch(`/api/users/${user.user_id}/delete-account`, req);

            if (response.status === 204) {
                setMessage('Account successfully deleted.');
                // the onDeleteSuccess prop calls handleSignOut from App.jsx
                setTimeout(() => onDeleteSuccess(), 1500);
            } else {
                const result = await response.json();
                setMessage(result.error || 'Failed to delete account. Please try again.')
            }
        } catch (error) {
            console.error('Fetch error: ', error);
            setMessage('Network error. Could not connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isConfirmed) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='bg-[#033500] p-8 mb-50 rounded-xl shadow-2xl w-full max-w-md border border-blue-700 animate-pulse-border'>
                    <h2 className='text-3xl font-bold mb-8 text-center text-gray-300'>
                        Confirm Account Deletion
                    </h2>
                    <p className='text-center text-red-400 mb-6'>
                        Warning: This action is permanent and cannot be undone. All your game data will be lost.
                    </p>
                    <div className='flex flex-col space-y-4'>
                        <button
                            onClick={handleConfirm}
                            className='w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-200 font-semibold cursor-pointer'
                            disabled={isLoading}
                        >
                            I understand, proceed to delete
                        </button>
                        <a 
                            href='#play-home'
                            className='w-full text-center text-blue-400 py-3 px-4 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 font-semibold cursor-pointer'
                        >
                            Cancel
                        </a>
                    </div>
                    
                </div>
            </div>
        )
    }

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='bg-[#033500] p-8 mb-50 rounded-xl shadow-2xl w-full max-w-md border border-blue-700 animate-pulse-border'>
                <h2 className='text-3xl font-bold mb-8 text-center text-gray-300'>
                    Delete Account
                </h2>
                <form onSubmit={handleDelete} className='space-y-8'>
                    <h2 className='text-2xl'>{isLoading ? 'Processing...' : ''}</h2>
                    {message && <p className='text-red-900'>{message}</p>}
                    <div>
                        <label
                            htmlFor='password'
                            className='block text-lg font-medium text-gray-100 mb-2'
                        >
                            Enter your password to confirm deletion
                        </label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-900 focus:border-blue-900 transition duration-150 ease-in-out'
                            placeholder='Enter your password'
                            onChange={handlePasswordChange}
                            value={password}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <button
                            type='submit'
                            className='w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-200 font-semibold cursor-pointer'
                            disabled={isLoading}
                        >
                            Delete Account
                        </button>
                        <a 
                            href='#play-home'
                            className='w-full text-center text-blue-400 py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 font-semibold cursor-pointer'
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default DeleteForm;
