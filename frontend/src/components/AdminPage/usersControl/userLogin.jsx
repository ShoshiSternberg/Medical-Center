import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { userLogin } from '../../../clientServices/UserService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getRoleById } from '../../../clientServices/RoleService';
import './errorMessage.css';

function MyVerticallyCenteredModal(props) {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        Password: '',
        Email: '',
    });

    const [error, setError] = useState(false);

    const [empty, setEmpty] = useState('');

    const handleUserLogin = async () => {
        try {
            if (user.Password === '' && user.Email === '')
                setEmpty(" כתובת מייל וסיסמא");
            else {
                if (user.Password === '')
                    setEmpty(" סיסמא ");
                else {
                    if (user.Email === '')
                        setEmpty(" כתובת מייל ");
                    else {
                        var userData = await userLogin(user);
                        userData = userData.data;
                        if (userData) {
                            sessionStorage.setItem('email', userData.Email);
                            var role = await getRoleById(userData.RoleID);
                            sessionStorage.setItem('role', role.data.Role);
                            if (userData.RoleID === 1)
                                navigate('/admin', { state: 1 });
                            else {
                                if (userData.RoleID === 2)
                                    navigate('/rooms');
                                else
                                    navigate('/admin', { state: 0 });
                            }
                        }
                        else
                            setError(true);
                    }
                }
            }
        } catch (error) {
            console.error('Error login user:', error);
            setError(true);
        }
    };

    const setPassword = async (e) => {
        setUser({ ...user, Password: e.target.value });
        setError(false);
        setEmpty('');
    }

    const setEmail = async (e) => {
        setUser({ ...user, Email: e.target.value })
        setError(false);
        setEmpty('');
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h4>כניסת משתמש</h4>
                <form>
                    <input
                        type="password"
                        placeholder="Password"
                        value={user.Password}
                        // onChange={(e) => setUser({ ...user, Password: e.target.value })}
                        onChange={(e) => setPassword(e)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={user.Email}
                        // onChange={(e) => setUser({ ...user, Email: e.target.value })}
                        onChange={(e) => setEmail(e)}
                    />
                </form>
            </Modal.Body>
            {empty !== '' && <span className='errorMessage' dir='rtl'>חובה להכניס {empty}</span>}
            {error && <span className='errorMessage' dir='rtl'>כתובת המייל או הסיסמא שגויים</span>}
            <Modal.Footer>
                <Button onClick={() => navigate('/pagesNavigate')}>סגירה</Button>
                <Button onClick={() => navigate('/forgotPassword')}>שכחתי סיסמא</Button>
                <Button onClick={handleUserLogin}>כניסה</Button>
            </Modal.Footer>
        </Modal>
    );
}


const UserLogin = () => {

    return (
        <div>
            <MyVerticallyCenteredModal
                show={true}
            />
        </div>
    );
};

export default UserLogin;
