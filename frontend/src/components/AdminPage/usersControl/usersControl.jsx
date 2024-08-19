import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getUsers, createUser, getUserByEmailAddress } from '../../../clientServices/UserService';
import { getRoles } from '../../../clientServices/RoleService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Role from '../../sidebar/role';
import './errorMessage.css';

function MyVerticallyCenteredModal(props) {
    const [newUser, setNewUser] = useState({
        Name: '',
        RoleID: 0,
        Password: '',
        Email: '',
        Phone: '',
        Status: true
    });

    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);

    const [errors, setErrors] = useState({
        Name: '',
        RoleID: '',
        Password: '',
        Email: '',
        Phone: '',
    })

    const fetchRoles = async () => {
        try {
            const response = await getRoles();
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        if (!sessionStorage.getItem('email')) {
            navigate('/pagesNavigate');
        }
        else {
            fetchRoles();
        }
    }, []);

    const validateUserName = () => {
        // Check if username is empty
        if (newUser.Name === '') {
            return "שדה חובה";
        }

        // Check if username contains allowed characters
        const regex = /^[a-zA-Z]{3,30}$/;
        if (!regex.test(newUser.Name)) {
            return "שם לא חוקי";
        }
        return '';
    };

    const validatePhoneNumber = () => {
        // Check if phone number is empty
        if (newUser.Phone === '') {
            return "שדה חובה";
        }

        const regex = /^\d{10}$/;
        if (!regex.test(newUser.Phone)) {
            return "מספר לא חוקי";
        }
        return '';
    };

    const validatePassword = () => {
        // Check if password is empty
        if (newUser.Password === '') {
            return "שדה חובה";
        }

        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!regex.test(newUser.Password)) {
            return "אורך הסיסמא חייב להיות לפחות 6 תווים. סיסמא חייבת לכלול: לפחות אות אחת, לפחות ספרה אחת, לפחות תו מיוחד אחד";
        }
        return '';
    };

    const validateEmail = () => {
        // Check if email is empty
        if (newUser.Email === '') {
            return "שדה חובה";
        }

        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!regex.test(newUser.Email)) {
            return "כתובת מייל לא חוקית";
        }
        return '';
    };

    const validateRole = () => {
        if (newUser.RoleID === 0) {
            return "שדה חובה";
        }
        return '';
    }

    const validateInputs = () => {
        const errors = {
            Name: validateUserName(),
            RoleID: validateRole(),
            Password: validatePassword(),
            Email: validateEmail(),
            Phone: validatePhoneNumber(),
        };

        setErrors(errors);
        return !Object.values(errors).some(error => error !== '');
    }

    const handleCreateUser = async () => {
        try {
            var result = await validateInputs();
            if (!result) {
                return;
            }
            var isExist = await getUserByEmailAddress(newUser.Email);
            if (isExist.data !== null) {
                setErrors(prev => ({ ...prev, Email: "כתובת המייל כבר קיימת" }));
                return;
            }
            await createUser(newUser);
            props.onHide();
            props.refreshUsers();
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    הוספת משתמש        </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>הוספת משתמש חדש</h4>
                <form className="form-container">
                    <input
                        type="text"
                        name="Name"
                        placeholder="Name"
                        value={newUser.Name}
                        onChange={handleInputChange}
                    />
                    <span className='errorMessage'>{errors.Name}</span>
                    {roles ? (
                        <select
                            name="RoleID"
                            value={newUser.RoleID}
                            onChange={handleInputChange}
                        >
                            <option key={0} value={0}>
                                Role
                            </option>
                            {roles.map((role) => (
                                <option key={role.ID} value={role.ID}>
                                    {role.Role}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>Loading roles...</p>
                    )}
                    <span className='errorMessage'>{errors.RoleID}</span>
                    <input
                        name="Password"
                        type="password"
                        placeholder="Password"
                        value={newUser.Password}
                        onChange={handleInputChange}
                    />
                    <span className='errorMessage'>{errors.Password}</span>
                    <input
                        type="email"
                        name="Email"
                        placeholder="Email"
                        value={newUser.Email}
                        onChange={handleInputChange}
                    />
                    <span className='errorMessage'>{errors.Email}</span>
                    <input
                        type="text"
                        name="Phone"
                        placeholder="Phone"
                        value={newUser.Phone}
                        onChange={handleInputChange}
                    />
                    <span className='errorMessage'>{errors.Phone}</span>
                </form>
                {errors.global && (<span className='errorMessage'>{errors.global}</span>)}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>סגירה</Button>
                <Button onClick={handleCreateUser}>אישור</Button>
            </Modal.Footer>
        </Modal>
    );
}

const UsersTable = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={user.ID}>
                        <td>{index + 1}</td>
                        <td>{user.Name}</td>
                        <td>{user.Email}</td>
                        <td>{user.Phone}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

const UsersControl = () => {
    const [modalShow, setModalShow] = useState(false);

    const refreshUsers = () => {
        // Function to refresh the users list after creating a new user
        window.location.reload();
    };

    return (
        <div>
            <h1>ניהול משתמשים</h1>
            <Button variant="primary" onClick={() => setModalShow(true)}>
                הוספת משתמש חדש
            </Button>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                refreshUsers={refreshUsers}
            />

            <div>
                <h2>משתמשים</h2>
                <UsersTable />
            </div>
            <div className='roleContainer'>
                <Role />
            </div>
        </div>
    );
};

export default UsersControl;
