import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getUsers, createUser, getUserByEmailAddress } from '../../../clientServices/UserService';
import { getRoles } from '../../../clientServices/RoleService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Role from '../../sidebar/role';



function MyVerticallyCenteredModal(props) {
    const [newUser, setNewUser] = useState({
        Name: '',
        RoleID: '',
        Password: '',
        Email: '',
        Phone: '',
        Status: true
    });

    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);

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
        if (!newUser.Name) {
            return false;
        }

        // Check if username contains allowed characters
        const regex = /^[a-zA-Z0-9-_]{3,30}$/;
        if (!regex.test(newUser.Name)) {
            return false;
        }

        return true;
    };

    const validatePhoneNumber = () => {
        // Check if phone number is empty
        if (!newUser.Phone) {
            return false;
        }

        const regex = /^\d{10}$/;
        if (!regex.test(newUser.Phone)) {
            return false;
        }

        return true;
    };

    const validatePassword = () => {
        // Check if password is empty
        if (!newUser.Password) {
            return false;
        }

        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!regex.test(newUser.Password)) {
            return false;
        }

        return true;
    };

    const validateEmail = () => {
        // Check if email is empty
        if (!newUser.Email) {
            return false;
        }

        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!regex.test(newUser.Email)) {
            return false;
        }

        return true;
    };

    const validateRole = () => {
        if (newUser.RoleID === 0) {
            return false;
        }
        return true;
    }

    const validateInputs = () => {
        return validateUserName() &&
            validateRole() &&
            validatePassword() &&
            validateEmail() &&
            validatePhoneNumber();
    }

    const handleCreateUser = async () => {
        try {
            var result = await validateInputs();
            if (!result) {
                alert("Invalid input");
                return;
            }
            var isExist = await getUserByEmailAddress(newUser.Email);
            if (!isExist || !isExist.data) {
                alert('Email already Exist');
                return;
            }
            await createUser(newUser);
            props.onHide();
            props.refreshUsers();
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
                    הוספת משתמש        </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>הוספת משתמש חדש</h4>
                <form>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newUser.Name}
                        onChange={(e) => setNewUser({ ...newUser, Name: e.target.value })}
                    />
                    {roles ? (
                        <select
                            value={newUser.RoleID}
                            onChange={(e) => setNewUser({ ...newUser, RoleID: e.target.value })}
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
                    <input
                        type="password"
                        placeholder="Password"
                        value={newUser.Password}
                        onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={newUser.Email}
                        onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Phone"
                        value={newUser.Phone}
                        onChange={(e) => setNewUser({ ...newUser, Phone: e.target.value })}
                    />
                </form>
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
