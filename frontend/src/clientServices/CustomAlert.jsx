import React from 'react';
import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

// Styled Dialog using the MUI styled function
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {

    padding: theme.spacing(4),          // Increased padding for more space
    borderRadius: '10px',
    maxWidth: '900px',                  // Increased maxWidth for a larger modal
    fontWeight: '700',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Set font family

  },
}));

const CustomAlert = ({ open, onClose, message }) => {
  return (
    <StyledDialog open={open} onClose={onClose} dir="rtl">
      <DialogTitle 
        sx={{ 
          color: 'red', 
          fontSize: '2rem',               // Increased font size for the title
          fontWeight: 'bold' ,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Set font family

        }}
      >
        קריאת חירום!
      </DialogTitle>
      <DialogContent 
        sx={{ 
          fontSize: '1.5rem',             // Increased font size for the content text
        }}
      >
        <p>{message}</p>
      </DialogContent>
    </StyledDialog>
  );
};

export default CustomAlert;
