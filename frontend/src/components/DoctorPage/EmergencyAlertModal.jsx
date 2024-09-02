// EmergencyAlertModal.jsx
import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import './DoctorPage.css';
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
    textAlign: 'center'
  };
const EmergencyAlertModal = ({ open, handleClose, message }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} className="emergencyAlertModalBox">
                <Typography variant="h6" className="emergencyAlertModalMessage">
                    {message}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleClose} className="emergencyAlertModalButton">
                    OK
                </Button>
            </Box>
        </Modal>
    );
};

export default EmergencyAlertModal;
