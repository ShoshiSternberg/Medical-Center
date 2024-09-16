import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import { getRoles } from '../../../clientServices/RoleService';
import { getUsers, createUser, getUserByEmailAddress, deleteUser, updateUser } from '../../../clientServices/UserService';
import Role from '../../Role/role';
import { useLocation } from 'react-router-dom';
import { Box, Button, Modal, Typography, MenuItem } from '@mui/material';
import Sidebar from '../../sidebar/sidebar';
import '../../QueuesManagment/QueuesManagmentPage.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
};


const UsersTable = forwardRef((props, ref) => {
    const { onSelectUserInTable } = props;
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('Name');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleRowClick = (user) => {
        setSelectedUserId(user.ID);
        onSelectUserInTable(user); // Call the prop function with the selected room
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleToggleStatus = async () => {
        const userToToggle = users.find(user => user.ID === selectedUserId);
        if (userToToggle) {
            const updatedUser = { ...userToToggle, Status: !userToToggle.Status };
            console.log(updatedUser)
            try {
                await updateUser(updatedUser.ID, updatedUser);
                setUsers(users.map(user => user.ID === updatedUser.ID ? updatedUser : user));
            } catch (error) {
                console.error('Error updating user status:', error);
            }
        }
    };

    useImperativeHandle(ref, () => ({
        handleToggleStatus,
    }));

    const filteredUsers = users.filter((user) => {
        const name = (user.Name || '').toLowerCase();

        return (
            name.includes(searchQuery.toLowerCase())
        );
    });

    const sortedUsers = filteredUsers.sort((a, b) => {
        if (orderBy === 'Name') {
            return order === 'asc' ? a.Name.localeCompare(b.Name) : b.Name.localeCompare(a.Name);
        } else {
            return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
        }
    });

    return (
        <div>
            <TextField
                label="חיפוש"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">בחירה</TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'Name'}
                                    direction={orderBy === 'Name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('Name')}
                                >
                                    שם משתמש
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                מייל
                            </TableCell>
                            <TableCell align="center">
                                מספר טלפון
                            </TableCell>
                            <TableCell align="center">
                                סטטוס
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map((user) => (
                            <TableRow
                                key={user.ID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onClick={() => handleRowClick(user)}
                                style={{ cursor: 'pointer' }}
                                selected={selectedUserId === user.ID}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={selectedUserId === user.ID}
                                        onChange={() => handleRowClick(user)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {user.Name}
                                </TableCell>
                                <TableCell align="center">
                                    {user.Email}
                                </TableCell>
                                <TableCell align="center">
                                    {user.Phone}
                                </TableCell>
                                <TableCell align="center">
                                    {user.Status ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
});

function AddUserModal({ open, handleClose, user }) {
    const [newUser, setNewUser] = React.useState({
        Name: '',
        RoleID: '',
        Password: '',
        Email: '',
        Phone: '',
        Status: true
    });

    useEffect(() => {
        if (user !== null) {
            setNewUser(user);
        }
    }, [user]);

    const [roles, setRoles] = useState([]);

    const [errors, setErrors] = useState({
        Name: '',
        RoleID: '',
        Password: '',
        Email: '',
        Phone: ''
    });

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoles();
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
            }
        };

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
        if (user)
            return validateUserName() && validateRole() && validateEmail() && validatePhoneNumber();
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
                handleClose();
            }

        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const handleUpdateUser = async () => {
        try {
            if (!validateInputs()) {
                //alert("נתונים לא תקינים");
                return;
            }
            await updateUser(newUser.ID, newUser);
            if (user.Name === sessionStorage.getItem('name'))
                sessionStorage.setItem('name', newUser.Name);
            handleClose();
        }
        catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {user ? (<Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: 'bold' }}
                >
                    עדכון פרטי משתמש
                </Typography>) :
                    (<Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: 'bold' }}
                    >
                        הוספת משתמש
                    </Typography>)}
                <Box sx={{ mt: 2 }}>
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
                    {!user && (<TextField
                        type="password"
                        label="סיסמה"
                        value={newUser.Password}
                        onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })}
                        error={!!errors.Password}
                        helperText={errors.Password}
                        fullWidth
                        margin="normal"
                    />)}
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
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    {user ? (<Button variant="contained" color="primary" onClick={() => handleUpdateUser()} sx={{ marginRight: 3 }}>
                        עדכן משתמש
                    </Button>) : (<Button variant="contained" color="primary" onClick={() => handleCreateUser()} sx={{ marginRight: 3 }}>
                        הוסף משתמש
                    </Button>)}
                    <Button variant="contained" color="secondary" onClick={() => handleClose()}>
                        ביטול
                    </Button>
                </Box>
            </Box>
        </Modal >
    );
}

function DeleteUserModal({ open, handleClose, handleConfirm, userName }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: 'bold' }} // Change font family and weight
                >
                    מחיקת משתמש
                </Typography>
                <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2, fontFamily: 'Segoe UI, sans-serif', fontWeight: 'normal' }} // Change font family and weight
                    icon='warning'
                >
                    ?{userName} האם אתה בטוח שברצונך למחוק את המשתמש
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <button className='cancalOrSubmitBtn' onClick={() => handleConfirm()} sx={{ marginRight: 3 }}>
                        אישור
                    </button>
                    <button className='cancalOrSubmitBtn' onClick={() => handleClose()}>
                        ביטול
                    </button>
                </Box>
            </Box>
        </Modal>
    );
}

const UsersControl = () => {
    const [selectedUserInTable, setSelectedUserInTable] = useState(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);

    const location = useLocation();
    const role = location.state;
    const childRef = useRef();

    const divStyle = {
        width: '65%'
    };

    const refreshUsers = () => {
        window.location.reload();
    };

    const handleSelectUserInTable = (user) => {
        setSelectedUserInTable(user);
    };

    const handleOpenAddUserModal = () => {
        setIsAddUserModalOpen(true);
    };

    const handleCloseAddUserModal = () => {
        setIsAddUserModalOpen(false);
    };

    const handleOpenUpdateUserModal = () => {
        if (selectedUserInTable === null) {
            alert('בחר משתמש לעדכון');
        }
        else {
            handleOpenAddUserModal();
        }
    };

    const handleCloseUserDeleteModal = () => {
        setIsUserDeleteModalOpen(false);
    };

    const handleConfirmUserDeleteModal = async () => {
        try {
            console.log(selectedUserInTable.ID)
            await deleteUser(selectedUserInTable.ID);

            alert('המשתמש נמחק בהצלחה');
            setSelectedUserInTable(null);
            handleCloseUserDeleteModal();
        } catch (error) {
            console.error('Error deleting user:', error);
            // alert('כרגע החדר בשימוש, אין אפשרות למחוק אותו');
        }
    };


    return (
        <>
            <div className='queueManagmentContainer'>

                <Sidebar role={role} />
                <div className='roomsDetailsTableContainer' style={divStyle}>
                    <div className='managmentTitle'>משתמשים</div>

                    <UsersTable ref={childRef} onSelectUserInTable={handleSelectUserInTable} />
                    <div className='moreOperationCont'>
                        <div className='actionOfPatientContainer'>
                            <button className='moreOperation' onClick={() => handleOpenAddUserModal()}>הוספת משתמש</button>
                            <button className='moreOperation' onClick={() => childRef.current.handleToggleStatus()}>שנה סטטוס משתמש</button>
                            <button className='moreOperation' onClick={() => handleOpenUpdateUserModal()}>עדכון פרטי משתמש</button>
                            <button className='moreOperation' onClick={() => setIsUserDeleteModalOpen(true)}>מחיקת משתמש</button>
                        </div>
                    </div>
                </div>
                <Role />
            </div>

            <AddUserModal
                open={isAddUserModalOpen}
                handleClose={() => handleCloseAddUserModal()}
                user={selectedUserInTable}
            />

            <DeleteUserModal
                open={isUserDeleteModalOpen}
                handleClose={() => handleCloseUserDeleteModal()}
                handleConfirm={() => handleConfirmUserDeleteModal()}
                userName={selectedUserInTable ? `${selectedUserInTable.Name}` : ''}
            />
        </>
    );
};

export default UsersControl;
