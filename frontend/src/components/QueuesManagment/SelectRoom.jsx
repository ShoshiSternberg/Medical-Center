import React, { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getAllRooms } from '../../clientServices/RoomService';

export default function SelectRoom({ onSelectRoom }) {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await getAllRooms();
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    const handleChange = (event) => {
        const roomName = event.target.value;
        setSelectedRoom(roomName);
        const room = rooms.find(r => r.Name === roomName);
        onSelectRoom(room); // Pass the selected room object to the parent component
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="room-select-label">בחר חדר</InputLabel>
            <Select
                labelId="room-select-label"
                id="room-select"
                value={selectedRoom}
                label="בחר חדר"
                onChange={handleChange}
            >
                <MenuItem value="">
                    <em>בחירת חדר</em>
                </MenuItem>
                {rooms.length > 0 && rooms.map((room) => (
                    <MenuItem key={room.ID} value={room.Name}>
                        {room.Name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
