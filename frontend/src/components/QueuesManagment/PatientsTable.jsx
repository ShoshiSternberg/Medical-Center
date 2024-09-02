import React, { useState, useEffect } from 'react';
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
import { getAllPatientsWithQueueDetails } from '../../clientServices/PatientsService';

export default function PatientsTable({ patients, setPatients, onSelectPatient }) {
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('FirstName');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchFirst = async () => {
            const response = await getAllPatientsWithQueueDetails();
            setPatients(response.data.data);
        }
        fetchFirst();
    }, []);

    useEffect(() => {

        const fetchPatients = async () => {
            try {
                let p = patients;

                // Group patients by queue
                let queues = {};
                p.forEach(patient => {
                    patient.queues.forEach(queue => {
                        const queueId = queue.RoomId;
                        if (!queues[queueId]) {
                            queues[queueId] = [];
                        }
                        queues[queueId].push(patient);
                    });
                });

                // Sort patients within each queue and assign PriorityNumber
                Object.keys(queues).forEach(queueId => {
                    queues[queueId].sort((a, b) => {
                        return a.queues.find(q => q.RoomId === parseInt(queueId)).PriorityNumber -
                            b.queues.find(q => q.RoomId === parseInt(queueId)).PriorityNumber;
                    });

                    queues[queueId].forEach((patient, index) => {
                        const queue = patient.queues.find(q => q.RoomId === parseInt(queueId));
                        queue.PriorityNumber = index + 1;
                    });
                });

                // Flatten the queues object back into patientsData array
                let sortedPatients = [];
                Object.keys(queues).forEach(queueId => {
                    sortedPatients = sortedPatients.concat(queues[queueId]);
                });

                setPatients(sortedPatients);
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, [patients]);


    const handleRowClick = (patient) => {
        setSelectedPatientId(patient.ID);
        onSelectPatient(patient);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredPatients = patients ? patients.filter((patient) => {
        const fullName = `${patient.FirstName} ${patient.LastName}`.toLowerCase();
        const uniqueNumber = (patient.UniqueNumber || '').toLowerCase();
        const roomName = patient.queues.length > 0 ? (patient.queues[0].room.Name || '').toLowerCase() : '';
        const priorityNumber = patient.queues.length > 0 ? (patient.queues[0].PriorityNumber || '').toString().toLowerCase() : '';

        return (
            fullName.includes(searchQuery.toLowerCase()) ||
            uniqueNumber.includes(searchQuery.toLowerCase()) ||
            roomName.includes(searchQuery.toLowerCase()) ||
            priorityNumber.includes(searchQuery.toLowerCase())
        );
    }) : [];

    const sortedPatients = filteredPatients ? filteredPatients.sort((a, b) => {
        if (orderBy === 'FirstName' || orderBy === 'LastName') {
            return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
        } else if (orderBy === 'room') {
            const aRoom = a.queues.length > 0 ? a.queues[0].room.Name : '';
            const bRoom = b.queues.length > 0 ? b.queues[0].room.Name : '';
            return order === 'asc' ? aRoom.localeCompare(bRoom) : bRoom.localeCompare(aRoom);
        } else if (orderBy === 'PriorityNumber') {
            const aNumber = a.queues.length > 0 ? a.queues[0].PriorityNumber : '';
            const bNumber = b.queues.length > 0 ? b.queues[0].PriorityNumber : '';
            return order === 'asc' ? aNumber - bNumber : bNumber - aNumber;
        } else {
            return order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
        }
    }) : [];

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
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">בחירה</TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'FirstName'}
                                    direction={orderBy === 'FirstName' ? order : 'asc'}
                                    onClick={() => handleRequestSort('FirstName')}
                                >
                                    שם מטופל
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'UniqueNumber'}
                                    direction={orderBy === 'UniqueNumber' ? order : 'asc'}
                                    onClick={() => handleRequestSort('UniqueNumber')}
                                >
                                    מספר יחודי
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'room'}
                                    direction={orderBy === 'room' ? order : 'asc'}
                                    onClick={() => handleRequestSort('room')}
                                >
                                    חדר נוכחי
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'PriorityNumber'}
                                    direction={orderBy === 'PriorityNumber' ? order : 'asc'}
                                    onClick={() => handleRequestSort('PriorityNumber')}
                                >
                                    מספר בתור
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'HMOid'}
                                    direction={orderBy === 'HMOid' ? order : 'asc'}
                                    onClick={() => handleRequestSort('HMOid')}
                                >
                                    קופת חולים
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">
                                <TableSortLabel
                                    active={orderBy === 'tz'}
                                    direction={orderBy === 'tz' ? order : 'asc'}
                                    onClick={() => handleRequestSort('tz')}
                                >
                                    מספר זהות
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="center">שעת כניסה</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedPatients.map((patient) => (
                            <TableRow
                                key={patient.ID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                onClick={() => handleRowClick(patient)}
                                style={{ cursor: 'pointer' }}
                                selected={selectedPatientId === patient.ID}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={selectedPatientId === patient.ID}
                                        onChange={() => handleRowClick(patient)}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {patient.FirstName} {patient.LastName}
                                </TableCell>
                                <TableCell align="center">{patient.UniqueNumber}</TableCell>
                                <TableCell align="center">
                                    {patient.queues.length > 0 ? patient.queues[0].room.Name : 'N/A'}
                                </TableCell>
                                <TableCell align="center">
                                    {patient.queues.length > 0 ? patient.queues[0].PriorityNumber : 'N/A'}
                                </TableCell>
                                <TableCell align="center">{patient.HMO.Name}</TableCell>
                                <TableCell align="center">{patient.Tz}</TableCell>

                                <TableCell align="center">
                                    {patient.CheckIn ? new Date(patient.CheckIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
