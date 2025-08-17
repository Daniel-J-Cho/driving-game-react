import DeleteForm from '../components/DeleteForm/DeleteForm.jsx';
import Redirect from '../components/Redirect.jsx';
import { useAppContext } from '../lib/app-context.js';
import GameNavbar from '../components/Navbar/GameNavbar/GameNavbar.jsx';

const Delete = () => {
    const { user, handleSignOut } = useAppContext();

    if (!user) {
        return <Redirect to='#' />
    }

    return (
        <div className='auth-page-container'>
            <GameNavbar headerName='DELETE ACCOUNT' />
            <div className='auth-form-container'>
                <DeleteForm
                    onDeleteSuccess={handleSignOut}
                    user={user}
                />
            </div>
        </div>
    )
}

export default Delete;
