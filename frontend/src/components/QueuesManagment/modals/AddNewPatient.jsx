import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getAllHMOs } from '../../../clientServices/HmosService';
import { getAllRooms } from '../../../clientServices/RoomService';
import { addManualPatient } from '../../../clientServices/PatientsService'; // Import your patient service function

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

const AddPatientModal = ( {open, handleClose,insert }) => {
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientTz, setPatientTz] = useState('');
  const [patientHMO, setPatientHMO] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [hmos, setHmos] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchHMOs = async () => {
      try {
        const response = await getAllHMOs();
        setHmos(response.data);
      } catch (error) {
        console.error('Error fetching HMOs:', error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await getAllRooms();
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching Rooms:', error);
      }
    };

    fetchHMOs();
    fetchRooms();
  }, []);

  function IDValidator(id)
  {
      if (id.length !== 9 || isNaN(id)) {  // Make sure ID is formatted properly
          return false;
      }
      let sum = 0, incNum;
      for (let i = 0; i < id.length; i++) {
          incNum = Number(id[i]) * ((i % 2) + 1);  // Multiply number by 1 or 2
          sum += (incNum > 9) ? incNum - 9 : incNum;  // Sum the digits up and add to total
      }
      return (sum % 10 === 0);
  }
  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!patientFirstName || !patientLastName || !patientTz || !patientHMO || !selectedRoom) {
        alert('נא למלא את כל השדות הנדרשים');
        return;
      }

      // Construct patient object
      const patientData = {
        "firstName":patientFirstName,
        "lastName":patientLastName,
        "HMOid":patientHMO,
        "phone":"0",
        "Tz":patientTz,
        "roomId":selectedRoom
    }

      console.log(selectedRoom);
      // Call service function to add patient

      if(IDValidator(patientTz))
      {
        await insert(patientFirstName,patientLastName,patientHMO,"4849512",patientTz,selectedRoom);


        alert('המטופל נוסף בהצלחה');
        handleClose();
      }
      else{
        alert('תעודת זהות לא תקינה')
      }
  
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('אופס, שגיאה בהוספת המטופל');
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
          הוספת מטופל חדש
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="שם פרטי"
            value={patientFirstName}
            onChange={(e) => setPatientFirstName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="שם משפחה"
            value={patientLastName}
            onChange={(e) => setPatientLastName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="מספר תעודת זהות"
            value={patientTz}
            onChange={(e) => setPatientTz(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Select
            label="קופת חולים"
            value={patientHMO}
            onChange={(e) => setPatientHMO(e.target.value)}
            fullWidth
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="">
              <em>בחר קופת חולים</em>
            </MenuItem>
            {hmos.map(hmo => (
              <MenuItem key={hmo.ID} value={hmo.ID}>
                {hmo.Name}
              </MenuItem>
            ))}
          </Select>
          <Select
            label="חדר"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            fullWidth
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="">
              <em>בחר חדר</em>
            </MenuItem>
            {rooms.map(room => (
              <MenuItem key={room.ID} value={room.ID}>
                {room.Name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginRight: 3 }}>
            הוסף מטופל
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            ביטול
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddPatientModal;
