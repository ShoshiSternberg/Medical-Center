import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    Box,
    TextField,
    MenuItem,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { getUsers, createUser, getUserByEmailAddress } from '../../../clientServices/UserService';
import { getRoles } from '../../../clientServices/RoleService';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../sidebar/sidebar';
import Role from '../../Role/role';
import './usersControl.css'


function MyVerticallyCenteredModal(props) {
    const [newUser, setNewUser] = useState({
        Name: '',
        RoleID: '',
        Password: '',
        Email: '',
        Phone: '',
        Status: true,
    });

    const [roles, setRoles] = useState([]);

    const fetchRoles = async () => {
        try {
            const response = await getRoles();
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const validateUserName = () => {
        if (!newUser.Name) return false;

    };

    const validatePhoneNumber = () => {
        if (!newUser.Phone) return false;
        const regex = /^\d{10}$/;
        console.log(regex.test(newUser.Phone) + 'טלפון')
        return regex.test(newUser.Phone);

    };

    const validatePassword = () => {
        if (!newUser.Password) return false;
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
        console.log(regex.test(newUser.Password) + 'סיסמא')
        return regex.test(newUser.Password);
    };

    const validateEmail = () => {
        if (!newUser.Email) return false;
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        console.log(regex.test(newUser.Email) + 'מייל')
        return regex.test(newUser.Email);
    };

    const validateRole = () => {
        return newUser.RoleID !== 0;
    };

    const validateInputs = () => {
        return validateUserName() && validateRole() && validatePassword() && validateEmail() && validatePhoneNumber();
    };

    const handleCreateUser = async () => {
        try {
            if (!validateInputs()) {
                alert("נתונים לא תקינים");
                return;
            }
            const isExist = await getUserByEmailAddress(newUser.Email);
            console.log(isExist)
            if (isExist.data != null) {
                alert('כתובת מייל כבר קיימת');
                return;
            }
            else {
                await createUser(newUser);
                props.onClose();
                props.refreshUsers();
            }

        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="contained-modal-title-vcenter"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', direction: 'rtl' }}
        >
            <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 1, width: 400 }}>
                <Typography id="contained-modal-title-vcenter" variant="h6" component="h2">
                    הוספת משתמש
                </Typography>
                <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                    <TextField
                        label="שם"
                        value={newUser.Name}
                        onChange={(e) => setNewUser({ ...newUser, Name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        select
                        label="תפקיד"
                        value={newUser.RoleID}
                        onChange={(e) => setNewUser({ ...newUser, RoleID: e.target.value })}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value={0}>בחר תפקיד</MenuItem>
                        {roles.map((role) => (
                            <MenuItem key={role.ID} value={role.ID}>
                                {role.Role}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        type="password"
                        label="סיסמה"
                        value={newUser.Password}
                        onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        type="email"
                        label="אימייל"
                        value={newUser.Email}
                        onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="טלפון"
                        value={newUser.Phone}
                        onChange={(e) => setNewUser({ ...newUser, Phone: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button variant="outlined" color="secondary" onClick={props.onClose}>
                        סגירה
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleCreateUser}>
                        אישור
                    </Button>
                </Box>
            </Box>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '50%', direction: 'rtl' }}>
            <TableContainer component={Paper} sx={{ width: '100%' }}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>שם משתמש</TableCell>
                            <TableCell>מייל</TableCell>
                            <TableCell>מספר טלפון</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.ID}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.Name}</TableCell>
                                <TableCell>{user.Email}</TableCell>
                                <TableCell>{user.Phone}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    );
};

const UsersControl = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const location = useLocation();
    const role = location.state;

    const refreshUsers = () => {
        window.location.reload();
    };

    return (
        <>
            <div className='usersPageContainer'>

                <Sidebar role={role} />
                <div className='usersPageCont'>
                    <div>
                        ניהול משתמשים
                    </div>
                    <button onClick={() => setModalOpen(true)}>
                        הוספת משתמש חדש
                    </button>
                    <MyVerticallyCenteredModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        refreshUsers={refreshUsers}
                    />

                    <UsersTable />


                </div>
                <Role />
            </div>
        </>
    );
};

export default UsersControl;
