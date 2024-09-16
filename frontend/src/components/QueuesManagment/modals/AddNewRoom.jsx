// AddRoomModal.js
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { createRoom } from '../../../clientServices/RoomService';

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

export default function AddRoomModal({ open, handleClose }) {
  const [roomName, setRoomName] = React.useState('');

  const handleSubmit = async () => {
    try {
      await createRoom(roomName, false);
      alert(`חדר חדש נוסף: ${roomName}`);
      handleClose();
    } catch (error) {
      console.error('Error adding room:', error);
      alert('Failed to add room.');
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
          הוספת חדר חדש
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="שם חדר"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />

        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginRight: 3 }}>
            הוסף חדר
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            ביטול
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
