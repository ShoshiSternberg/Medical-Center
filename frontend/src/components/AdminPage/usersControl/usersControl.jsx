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
import { getUsers, createUser, getUserByEmailAddress, deleteUser } from '../../../clientServices/UserService';
import { getRoles } from '../../../clientServices/RoleService';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../sidebar/sidebar';
import Role from '../../Role/role';
import './usersControl.css';
import Swal from 'sweetalert2';


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
    const [errors, setErrors] = useState({
        Name: '',
        RoleID: '',
        Password: '',
        Email: '',
        Phone: ''
    });

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
        if (!newUser.Name) {
            setErrors(prevErrors => ({ ...prevErrors, Name: 'שם משתמש נדרש' }));
            console.log(errors);
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, Name: '' }));
        return true;
    };

    const validatePhoneNumber = () => {
        if (!newUser.Phone) {
            setErrors(prevErrors => ({ ...prevErrors, Phone: 'מספר טלפון נדרש' }));
            return false;
        }
        const regex = /^\d{10}$/;
        if (!regex.test(newUser.Phone)) {
            setErrors(prevErrors => ({ ...prevErrors, Phone: 'מספר טלפון לא תקין' }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, Phone: '' }));
        return true;
    };

    const validatePassword = () => {
        if (!newUser.Password) {
            setErrors(prevErrors => ({ ...prevErrors, Password: 'סיסמה נדרשת' }));
            return false;
        }
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!regex.test(newUser.Password)) {
            setErrors(prevErrors => ({ ...prevErrors, Password: 'סיסמה חייבת להכיל לפחות 6 תווים, כולל אות ומספר' }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, Password: '' }));
        return true;
    };

    const validateEmail = () => {
        if (!newUser.Email) {
            setErrors(prevErrors => ({ ...prevErrors, Email: 'כתובת אימייל נדרשת' }));
            return false;
        }
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!regex.test(newUser.Email)) {
            setErrors(prevErrors => ({ ...prevErrors, Email: 'כתובת אימייל לא תקינה' }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, Email: '' }));
        return true;
    };

    const validateRole = () => {
        if (newUser.RoleID === '' || newUser.RoleID === 0) {
            setErrors(prevErrors => ({ ...prevErrors, RoleID: 'תפקיד נדרש' }));
            return false;
        }
        setErrors(prevErrors => ({ ...prevErrors, RoleID: '' }));
        return true;
    };

    const validateInputs = () => {
        return validateUserName() && validateRole() && validatePassword() && validateEmail() && validatePhoneNumber();
    };

    const handleCreateUser = async () => {
        try {
            if (!validateInputs()) {
                //alert("נתונים לא תקינים");
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
                        error={errors.Name != ''}
                        helperText={errors.Name}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        select
                        label="תפקיד"
                        value={newUser.RoleID}
                        onChange={(e) => setNewUser({ ...newUser, RoleID: e.target.value })}
                        error={!!errors.RoleID}
                        helperText={errors.RoleID}
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
                        error={!!errors.Password}
                        helperText={errors.Password}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        type="email"
                        label="אימייל"
                        value={newUser.Email}
                        onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })}
                        error={!!errors.Email}
                        helperText={errors.Email}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="טלפון"
                        value={newUser.Phone}
                        onChange={(e) => setNewUser({ ...newUser, Phone: e.target.value })}
                        error={!!errors.Phone}
                        helperText={errors.Phone}
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

    const [selectedUser, setSelectedUser] = useState(null);
    const [updateUserModalOpen, setUpdateUserModalOpen] = useState(false);

    const deleteUserById = async (userId) => {
        await deleteUser(userId); // Call delete user API from UserService
        const updatedUsers = users.filter((user) => user.ID !== userId);
        setUsers(updatedUsers);
    }

    const handleDeleteUser = async (userId) => {
        Swal.fire({
            title: 'האם אתה בטוח?',
            text: 'פעולה זו תמחק את המשתמש באופן סופי',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור',
            cancelButtonText: 'ביטול'
        }).then((result) => {
            if (result.isConfirmed) {
                // אם המשתמש אישר, בצע את פעולת המחיקה
                try {
                    deleteUserById(userId);
                } catch (error) {
                    console.error("Error deleting user:", error);

                }
            }
        });
    };

    const handleUpdateUserOpen = (user) => {
        setSelectedUser(user);
        setUpdateUserModalOpen(true);
    };

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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.ID}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{user.Name}</TableCell>
                                <TableCell>{user.Email}</TableCell>
                                <TableCell>{user.Phone}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" size="small" onClick={() => handleUpdateUserOpen(user)}>
                                        עדכון
                                    </Button>
                                    <Button variant="contained" color="error" size="small" onClick={() => handleDeleteUser(user.ID)}>
                                        מחיקה
                                    </Button>
                                </TableCell>
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
