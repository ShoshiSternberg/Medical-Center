import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button
} from '@mui/material';
import { updateUser, getUserByEmailAddress } from '../../../clientServices/UserService';

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
            const email = sessionStorage.getItem('email');
            const user = await getUserByEmailAddress(email);
            console.log(user);

            const updatedUser = {
                Name: user.data.Name,
                RoleID: user.data.RoleID,
                Password: password.NewPassword,
                Email: user.data.Email,
                Phone: user.data.Phone,
                Status: user.data.Status === true? 1: 0
            };
            console.log(updatedUser)
            const userUpdateData = await updateUser(user.data.ID, updatedUser);
            console.log(userUpdateData)
            navigate('/pagesNavigate', { state: user.data.RoleID});
            props.onClose();
        } catch (error) {
            console.error('Error update user:', error);
        }
    };

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 450,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    direction: 'rtl', // Set RTL direction

                }}
            >
                <Typography id="modal-title" variant="h6" component="h2" sx={{ fontFamily: 'Segoe UI, sans-serif' }}>
                    עדכון סיסמא
                </Typography>

                <TextField
                    type="password"
                    label=" סיסמא חדשה  "
                    value={password.NewPassword}
                    onChange={(e) => setPassword({ ...password, NewPassword: e.target.value })}
                    variant="outlined"
                    fullWidth
                    sx={{ fontFamily: 'Segoe UI, sans-serif' }} // Apply the font here to the input
                    InputLabelProps={{
                        sx: { fontFamily: 'Segoe UI, sans-serif' } // Apply the font here to the label
                    }}
                />
                <TextField
                    type="password"
                    label="  אשר סיסמא  "
                    value={password.ConfirmPassword}
                    onChange={(e) => setPassword({ ...password, ConfirmPassword: e.target.value })}
                    variant="outlined"
                    fullWidth
                    sx={{ fontFamily: 'Segoe UI, sans-serif' }} // Apply the font here to the input
                    InputLabelProps={{
                        sx: { fontFamily: 'Segoe UI, sans-serif' } // Apply the font here to the label
                    }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mt: 2,
                        fontFamily: 'Segoe UI, sans-serif', // Apply the font here (if any text inside Box)
                    }}
                >
                    <Button
                        onClick={props.onClose}
                        variant="outlined"
                        sx={{
                            fontFamily: 'Segoe UI, sans-serif', // Apply the font
                            color: 'red',                       // Change the text color to red
                            borderColor: 'red',                 // Change the border color to red
                            '&:hover': {
                                borderColor: 'darkred',         // Optionally, change the border color on hover
                                color: 'darkred',               // Optionally, change the text color on hover
                            }
                        }}
                    >
                        סגירה
                    </Button>
                    <Button
                        onClick={handleUpdateUser}
                        variant="contained"
                        color="primary"
                        sx={{ fontFamily: 'Segoe UI, sans-serif' }} // Apply the font here
                    >
                        שמירה
                    </Button>
                </Box>

            </Box>
        </Modal >
    );
}

const NewPassword = () => {
    const [modalShow, setModalShow] = useState(true);

    return (
        <div>
            <MyVerticallyCenteredModal
                open={modalShow}
                onClose={() => setModalShow(false)}
            />
        </div>
    );
};

export default NewPassword;
