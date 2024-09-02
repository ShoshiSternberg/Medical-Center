import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './modal.css'

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

export default function DeleteRoomModal({ open, handleClose, handleConfirm, roomName }) {
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
                    מחיקת חדר
                </Typography>
                <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2, fontFamily: 'Segoe UI, sans-serif', fontWeight: 'normal' }} // Change font family and weight
                >
                    ?האם אתה בטוח שברצונך למחוק את חדר {roomName}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <button className='cancalOrSubmitBtn' onClick={handleConfirm} sx={{ marginRight: 3 }}>
                        אישור
                    </button>
                    <button className='cancalOrSubmitBtn' onClick={handleClose}>
                        ביטול
                    </button>
                </Box>
            </Box>
        </Modal>
    );
}
