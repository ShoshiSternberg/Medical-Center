import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button
} from '@mui/material';

function MyVerticallyCenteredModal(props) {

    const location = useLocation();
    const generatedPassword = location.state;

    const navigate = useNavigate();

    const [temporaryPassword, setTemporaryPassword] = useState('');

    const startTime = new Date().getTime();
    // const [error, setError] = useState('');
    const [errorStatus, setErrorStatus] = useState(false);

    useEffect(() => {
        if (!sessionStorage.getItem('email')) {
            navigate('/userLogin');
        }
        const timer = setInterval(() => {
            const currentTime = new Date().getTime();
            if (currentTime - startTime >= 5 * 60 * 1000) {
                // setError("הזמן להכניס את הסיסמה הזמנית פג. בבקשה בקש סיסמה זמנית חדשה");
                setErrorStatus(true);
                alert("5 minutes have passed since you started.");
                clearInterval(timer);
            }
        }, 50000);

        return () => clearInterval(timer);
    }, []);

    const checkTemporaryPassword = () => {
        if (temporaryPassword === generatedPassword) {
            navigate('/newPassword');
        } else {
            alert("The password is incorrect");
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
                    direction: 'rtl', 

                }}
            >


                <Typography id="modal-title" variant="h6" component="h2"
                    sx={{ fontFamily: 'Segoe UI, sans-serif' }}>
                    סיסמא זמנית
                </Typography>


                <TextField
                    type="password"
                    label="הזן סיסמא זמנית"
                    value={temporaryPassword}
                    onChange={(e) => setTemporaryPassword(e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{ fontFamily: 'Segoe UI, sans-serif' }} 
                />

                {!errorStatus && (<Button
                    onClick={checkTemporaryPassword}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ fontFamily: 'Segoe UI, sans-serif' }} 
                >
                    אישור
                </Button>)}
                {errorStatus && (<Button
                    onClick={() => navigate('/userLogin')}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ fontFamily: 'Segoe UI, sans-serif' }} 
                >
                    שכחתי סיסמא
                </Button>)}
            </Box>
        </Modal>
    );
}

const ConfirmPassword = () => {
    const [modalOpen, setModalOpen] = useState(true);

    const handleClose = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <MyVerticallyCenteredModal
                open={modalOpen}
                onClose={handleClose}
            />
        </div>
    );
};

export default ConfirmPassword;
