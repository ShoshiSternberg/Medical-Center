import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const DoctorAlert = ({ open, handleClose, message }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box className="alertModal">
                <Typography variant="h6" component="h2" className="alertTitle">
                    התראת חירום
                </Typography>
                <Typography variant="body1" className="alertMessage">
                    {message}
                </Typography>
                <Button onClick={handleClose} className="alertButton" variant="contained" color="secondary">
                    סגור
                </Button>
            </Box>
        </Modal>
    );
};

export default DoctorAlert;
