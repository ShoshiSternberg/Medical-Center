
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { createMessage } from '../../clientServices/MessagesService';

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

export default function AddMessageModal({ open, handleClose,updateMessagesFromClient }) {
    const [content, setContent] = useState('');
    const [status, setStatus] = useState(false);

    const handleSubmit = async () => {
        try {
            await createMessage(content, status);
            updateMessagesFromClient();
            alert(`נוספה הודעה חדשה ${content}`);
            handleClose();
        } catch (error) {
            console.error('Error adding message:', error);
            alert('Failed to add message.');
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
                <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    sx={{ fontFamily: 'Segoe UI, sans-serif', fontWeight: 'bold' }}
                >
                    הוספת הודעה חדשה
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="תוכן הודעה"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <Select
                        label="סטטוס פעילות"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        fullWidth
                        displayEmpty
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="">
                            <em>סטטוס פעילות</em>
                        </MenuItem>

                        <MenuItem key={1} value={true}>
                            פעיל
                        </MenuItem>
                        <MenuItem key={2} value={false}>
                            לא פעיל
                        </MenuItem>

                    </Select>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginRight: 3 }}>
                        הוסף הודעה
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleClose}>
                        ביטול
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
