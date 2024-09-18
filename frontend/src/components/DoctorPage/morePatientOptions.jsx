import React, { useState, useEffect } from 'react';
import { getAllPatientsWithQueueDetails } from '../../clientServices/PatientsService';
import SelectRoom from '../QueuesManagment/SelectRoom';
import './MorePatientOptions.css';
import './ReceptionOperations.css';
import useReceptionSocket from '../../clientServices/ReceptionSocket';
import DeletePatientModal from '../QueuesManagment/modals/DeletePatient';

const MorePatientOptions = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { moveRoom, emergencyAlertToDoctor, endOfTreatment, insertPatient } = useReceptionSocket(setSelectedPatient, patients, setPatients);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await getAllPatientsWithQueueDetails();
                setPatients(response.data.data);
                setFilteredPatients(response.data.data); // Initialize filteredPatients with all patients
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        fetchPatients();
    }, []);

    useEffect(() => {
        const filterResults = patients.filter((patient) =>
            (patient.UniqueNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(patient.Tz || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPatients(filterResults);
    }, [searchQuery, patients]);

    const handleRowClick = (patient) => {
        setSelectedPatient(patient);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleMoveToEndOfQueue = async () => {
        if (selectedPatient && selectedRoom) {
            try {
                console.log(selectedPatient.ID);
                await moveRoom(selectedRoom.ID, selectedPatient.ID, true);
                alert('המטופל הועבר לסוף התור בהצלחה');
                setSelectedPatient(null);
                setSelectedRoom(null);
            } catch (error) {
                console.error('Error moving patient to end of queue:', error);
                alert('Failed to move patient to the end of the queue.');
            }
        } else {
            if (!selectedPatient) {
                alert('בחר מטופל');
            }
            if (!selectedRoom) {
                alert('בחר חדר');
            }
        }
    };

    const handleMoveToFrontOfQueue = async () => {
        if (selectedPatient && selectedRoom) {
            try {
                await moveRoom(selectedRoom.ID, selectedPatient.ID, false);
                alert('המטופל הועבר לתחילת התור בהצלחה');
                setSelectedPatient(null);
                setSelectedRoom(null);
            } catch (error) {
                console.error('Error moving patient to front of queue:', error);
                alert('Failed to move patient to the front of the queue.');
            }
        } else {
            if (!selectedPatient) {
                alert('בחר מטופל');
            }
            if (!selectedRoom) {
                alert('בחר חדר');
            }
        }
    };

    const handleFinishTreatment = async () => {
        if (selectedPatient) {
            setIsDeleteModalOpen(true);
        } else {
            alert('בחר מטופל');
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDeleteModal = async () => {
        if (selectedPatient) {
            try {
                await endOfTreatment(selectedPatient.ID);
                setPatients(patients.filter(patient => patient.ID !== selectedPatient.ID));
                setIsDeleteModalOpen(false);
                setSelectedPatient(null);
                alert('טיפול הסתיים בהצלחה');
            } catch (error) {
                console.error('Error finishing treatment:', error);
                alert('Failed to finish treatment.');
            }
        }
    };

    return (
        <>
            <div className='MorePatientOptionsContainer'>
                {selectedPatient ? (
                    <div className='selectedPatientCont'>
                        <span>נבחר מטופל: {selectedPatient.UniqueNumber} | {selectedPatient.Tz}</span>
                        <div>חדר נוכחי: {selectedPatient.queues.length > 0 ? selectedPatient.queues[0].room.Name : 'N/A'}</div>
                    </div>
                ) : (
                    <div>לא נבחר מטופל</div>
                )}

                <input
                    type="text"
                    placeholder="חיפוש לפי מספר יחודי או זהות"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />

                <div className="table-wrapper">
                    <table className="small-table">
                        <thead>
                            <tr>
                                <th>מספר יחודי</th>
                                <th>מספר זהות</th>
                                <th>חדר נוכחי</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr
                                    key={patient.ID}
                                    className={selectedPatient?.ID === patient.ID ? 'selected' : ''}
                                    onClick={() => handleRowClick(patient)}
                                >
                                    <td>{patient.UniqueNumber}</td>
                                    <td>{patient.Tz}</td>
                                    <td>{patient.queues.length > 0 ? patient.queues[0].room.Name : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="ReceptionOperationsCont">
                    <div className='btn-cont-reception'>
                        <div>
                            <SelectRoom onSelectRoom={setSelectedRoom} />
                        </div>

                        <button className="action-reception-btn" onClick={handleMoveToFrontOfQueue}>
                            העבר לראש התור
                        </button>
                        <button className="action-reception-btn" onClick={handleMoveToEndOfQueue}>
                            העבר לסוף התור
                        </button>
                    </div>

                    <button className="endTreatBtn" onClick={handleFinishTreatment}>
                        <div>סיום טיפול</div>
                    </button>
                </div>
            </div>

            <DeletePatientModal
                open={isDeleteModalOpen}
                handleClose={handleCloseDeleteModal}
                handleConfirm={handleConfirmDeleteModal}
                patientName={selectedPatient ? `${selectedPatient.FirstName} ${selectedPatient.LastName}` : ''}
            />
        </>
    );
};

export default MorePatientOptions;
