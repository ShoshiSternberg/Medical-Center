import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import TableSortLabel from '@mui/material/TableSortLabel';
import TextField from '@mui/material/TextField';
import { getAllRooms, updateRoom } from '../../clientServices/RoomService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const RoomsTable = forwardRef((props, ref) => {
    const { onSelectRoomInTable } = props;
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('Name');
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleRowClick = (room) => {
        if (selectedRoomId === room.ID) {
            setSelectedRoomId(null);
            onSelectRoomInTable(null);
        } else {
            setSelectedRoomId(room.ID);
            onSelectRoomInTable(room); // Call the prop function with the selected room
        }
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleToggleStatus = async () => {
        const roomToToggle = rooms.find(room => room.ID === selectedRoomId);
        if (roomToToggle) {
            const updatedRoom = { ...roomToToggle, Status: !roomToToggle.Status };
            console.log(updatedRoom)
            try {
                await updateRoom(updatedRoom.ID,updatedRoom.Name,updatedRoom.Status);
                setRooms(rooms.map(room => room.ID === updatedRoom.ID ? updatedRoom : room));
            } catch (error) {
                console.error('Error updating room status:', error);
            }
        }
    };

    useImperativeHandle(ref, () => ({
        handleToggleStatus,
    }));

    const filteredRooms = rooms.filter((room) => {
        const name = (room.Name || '').toLowerCase();
        const currentQueueNumber = (room.CurrentQueueNumber || '').toString().toLowerCase();

        return (
            name.includes(searchQuery.toLowerCase()) ||
            currentQueueNumber.includes(searchQuery.toLowerCase()) 
        );
    });

    const sortedRooms = filteredRooms.sort((a, b) => {
        if (orderBy === 'Name') {
            return order === 'asc' ? a.Name.localeCompare(b.Name) : b.Name.localeCompare(a.Name);
        } else if (orderBy === 'CurrentQueueNumber') {
            return order === 'asc' ? a.CurrentQueueNumber - b.CurrentQueueNumber : b.CurrentQueueNumber - a.CurrentQueueNumber;
        } else {
            return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
        }
    });

    return (
        <div>
            <TextField
                label="חיפוש"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">בחירה</TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'Name'}
                                    direction={orderBy === 'Name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('Name')}
                                >
                                    שם חדר
                                </TableSortLabel>
                            </TableCell>
                            
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'Status'}
                                    direction={orderBy === 'Status' ? order : 'asc'}
                                    onClick={() => handleRequestSort('Status')}
                                >
                                    סטטוס פעילות
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRooms.map((room) => (
                            <TableRow
                                key={room.ID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onClick={() => handleRowClick(room)}
                                style={{ cursor: 'pointer' }}
                                selected={selectedRoomId === room.ID}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={selectedRoomId === room.ID}
                                        onChange={() => handleRowClick(room)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {room.Name}
                                </TableCell>
                             
                                <TableCell align="center">
                                    {room.Status ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
});

export default RoomsTable;
