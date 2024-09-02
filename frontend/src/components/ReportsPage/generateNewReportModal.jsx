// GenerateReportModal.js
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

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

export default function GenerateReportModal({ open, handleClose, onSubmit, successMessage }) {
    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleSubmit = () => {
        onSubmit(selectedDate);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                {successMessage ? (
                    <Typography
                        id="modal-description"
                        variant="h6"
                        component="h2"
                        sx={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: 'bold', mb: 2 }}
                    >
                        {successMessage}
                    </Typography>
                ) : (
                    <>
                        <Typography
                            id="modal-title"
                            variant="h6"
                            component="h2"
                            sx={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: 'bold' }}
                        >
                            הפק דוח לפי תאריך
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                type="date"
                                label="תאריך"
                                value={selectedDate}
                                onChange={handleDateChange}
                                fullWidth
                                sx={{ mb: 2 }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginRight: 3 }}>
                                הפק דוח
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleClose}>
                                ביטול
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    );
}
