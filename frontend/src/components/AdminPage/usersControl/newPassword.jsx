import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { updateUser, getUserByEmailAddress } from '../../../clientServices/UserService';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyVerticallyCenteredModal(props) {

    const navigate = useNavigate();

    const [password, setPassword] = useState({
        NewPassword: '',
        ConfirmPassword: '',
    });

    const validatePassword = () => {
        // Check if password is empty
        if (!password.NewPassword) {
            return false;
        }

        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!regex.test(password.NewPassword)) {
            return false;
        }

        if (password.NewPassword !== password.ConfirmPassword) {
            return false;
        }

        return true;
    };

    const handleUpdateUser = async () => {
        try {
            if (!validatePassword()) {
                alert("Invalid input");
                return;
            }
            var email = sessionStorage.getItem('email');
            var user = await getUserByEmailAddress(email);
            var updatedUser = {
                Name: user.data.Name,
                RoleID: user.data.RoleID,
                Password: password.NewPassword,
                Email: user.data.Email,
                Phone: user.data.Phone,
                Status: user.data.Status === true? 1: 0
            };
            await updateUser(user.data.ID, updatedUser);
            navigate('/userLogin');
            props.onHide();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    עדכון סיסמא
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>עדכון סיסמא</h4>
                <form>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password.NewPassword}
                        onChange={(e) => setPassword({ ...password, NewPassword: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={password.ConfirmPassword}
                        onChange={(e) => setPassword({ ...password, ConfirmPassword: e.target.value })}
                    />
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>סגירה</Button>
                <Button onClick={handleUpdateUser}>שמירה</Button>
            </Modal.Footer>
        </Modal>
    );
}


const NewPassword = () => {
    const [modalShow, setModalShow] = useState(true);

    return (
        <div>
            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </div>
    );
};

export default NewPassword;
