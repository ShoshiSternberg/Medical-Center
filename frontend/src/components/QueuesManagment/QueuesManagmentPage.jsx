import React, { useState, useRef } from 'react';
import './QueuesManagmentPage.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import NumbersIcon from '@mui/icons-material/Numbers';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
import PatientsTable from './PatientsTable';
import RoomsTable from './RoomsTable';
import Sidebar from '../sidebar/sidebar';
import SelectRoom from './SelectRoom';
import DeletePatientModal from './modals/DeletePatient';
import EmergencyDoctorAlertModal from './modals/EmergencyDoctorAlert';
import AddPatientModal from './modals/AddNewPatient';
import AddRoomModal from './modals/AddNewRoom';
import DeleteRoomModal from './modals/DeleteRoom';
import { deleteRoom } from '../../clientServices/RoomService';
import useReceptionSocket from '../../clientServices/ReceptionSocket';
import { useLocation } from 'react-router-dom';
import Role from '../Role/role';

const QueueManagmentPage = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedRoomInTable, setSelectedRoomInTable] = useState(null);
    const [patients, setPatients] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
    const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [isRoomDeleteModalOpen, setIsRoomDeleteModalOpen] = useState(false);

    const { moveRoom, emergencyAlertToDoctor, endOfTreatment, insertPatient } = useReceptionSocket(setSelectedPatient, patients, setPatients);

    const location = useLocation();
    const role = location.state;
    const handleSelectPatient = (patient) => {
        setSelectedPatient(patient);
    };
    const handleSelectRoomInTable = (room) => {
        setSelectedRoomInTable(room);
    };

    const childRef = useRef();

    const handleMoveToEndOfQueue = async () => {
        if (selectedPatient && selectedRoom) {
            try {
                console.log(selectedPatient.ID);
                await moveRoom(selectedRoom.ID, selectedPatient.ID, true);
                alert('המטופל הועבר לסוף התור בהצלחה');
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

    const handleOpenEmergencyModal = () => {
        if (selectedPatient && selectedRoom) {
            setIsEmergencyModalOpen(true);
        } else {
            alert('בחר מטופל וחדר');
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleCloseRoomDeleteModal = () => {
        setIsRoomDeleteModalOpen(false);
    };

    const handleCloseEmergencyModal = () => {
        setIsEmergencyModalOpen(false);
    };

    const handleConfirmDeleteModal = async () => {
        try {
            await endOfTreatment(selectedPatient.ID);
            alert('הטיפול הסתיים בהצלחה');
            setSelectedPatient(null);
            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Failed to delete patient.');
        }
    };

    const handleConfirmRoomDeleteModal = async () => {
        try {
            console.log(selectedRoomInTable.ID)
            await deleteRoom(selectedRoomInTable.ID);

            alert('החדר נמחק בהצלחה');
            setSelectedRoomInTable(null);
            handleCloseRoomDeleteModal();
        } catch (error) {
            console.error('Error deleting room:', error);
            alert('כרגע החדר בשימוש, אין אפשרות למחוק אותו');
        }
    };

    const handleConfirmEmergencyModal = () => {
        emergencyAlertToDoctor(selectedPatient.UniqueNumber, selectedRoom.Name);
        alert('קריאת חירום נשלחה לרופא');
        handleCloseEmergencyModal();
    };

    const handleOpenAddPatientModal = () => {
        setIsAddPatientModalOpen(true);
    };

    const handleCloseAddPatientModal = () => {
        setIsAddPatientModalOpen(false);
    };

    const handleOpenAddRoomModal = () => {
        setIsAddRoomModalOpen(true);
    };

    const handleCloseAddRoomModal = () => {
        setIsAddRoomModalOpen(false);
    };



    const formattedCheckInTime = selectedPatient ? new Date(selectedPatient.CheckIn).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '---';

    return (
        <>
            <div className='queueManagmentContainer'>
                <Sidebar role={role} />
                <div className='patientsDetailsTableContainer'>
                    <div className='managmentTitle'>מטופלים</div>
                    <div className='patientsDetailsTableCont'>
                        <div className='patientDetailsContainer'>
                            <div className='patientDetail'>
                                <div className='detailTitleContainer'>
                                    <PersonIcon className='detailTitle' />
                                    <div className='detailTitle'>שם מטופל</div>
                                </div>
                                <div className='detailProperty'>
                                    {selectedPatient ? `${selectedPatient.FirstName} ${selectedPatient.LastName}` : '---'}
                                </div>
                            </div>

                            <div className='patientDetail'>
                                <div className='detailTitleContainer'>
                                    <ApartmentIcon className='detailTitle' />
                                    <div className='detailTitle'>קופת חולים</div>
                                </div>
                                <div className='detailProperty'>
                                    {selectedPatient ? selectedPatient.HMO.Name : '---'}
                                </div>
                            </div>
                            <div className='patientDetail'>
                                <div className='detailTitleContainer'>
                                    <NumbersIcon className='detailTitle' />
                                    <div className='detailTitle'>מספר מטופל</div>
                                </div>
                                <div className='detailProperty'>
                                    {selectedPatient ? selectedPatient.UniqueNumber : '---'}
                                </div>
                            </div>
                            <div className='patientDetail'>
                                <div className='detailTitleContainer'>
                                    <MeetingRoomIcon className='detailTitle' />
                                    <div className='detailTitle'>חדר</div>
                                </div>
                                <div className='detailProperty'>
                                    {selectedPatient && selectedPatient.queues.length > 0 ? selectedPatient.queues[0].room.Name : '---'}
                                </div>
                            </div>
                            <div className='patientDetail'>
                                <div className='detailTitleContainer'>
                                    <FormatListNumberedRtlIcon className='detailTitle' />
                                    <div className='detailTitle'>מיקום בתור</div>
                                </div>
                                <div className='detailProperty'>
                                    {selectedPatient && selectedPatient.queues.length > 0 ? selectedPatient.queues[0].PriorityNumber : '---'}
                                </div>
                            </div>

                            <div className='patientDetail'>
                                <div className='detailTitleContainer'>
                                    <FormatListNumberedRtlIcon className='detailTitle' />
                                    <div className='detailTitle'>מספר זהות</div>
                                </div>
                                <div className='detailProperty'>
                                    {selectedPatient && selectedPatient.queues.length > 0 ? selectedPatient.Tz : '---'}
                                </div>
                            </div>

                            <div className='patientDetail'>
                                <div className='detailTitleContainer'>
                                    <FormatListNumberedRtlIcon className='detailTitle' />
                                    <div className='detailTitle'>שעת כניסה</div>
                                </div>
                                <div className='detailProperty'>
                                    {formattedCheckInTime}
                                </div>
                            </div>
                        </div>
                        <div className='tableAndOperationCont'>
                            <PatientsTable patients={patients} setPatients={setPatients} onSelectPatient={handleSelectPatient} />
                            <div className='operationCont'>
                                <div className='actionOfPatientContainer'>
                                    <div className='listOfRoomsContainer'>
                                        <SelectRoom onSelectRoom={setSelectedRoom} />
                                    </div>
                                    <button className='moveToRoomBtn' onClick={handleMoveToEndOfQueue}>
                                        העבר לסוף התור
                                    </button>
                                    <button className='moveToRoomBtn' onClick={handleMoveToFrontOfQueue}>
                                        העבר לראש התור
                                    </button>
                                </div>
                                <button className='finishTreatment' onClick={handleFinishTreatment}>
                                    <CheckCircleIcon />
                                    <div>סיום טיפול</div>
                                </button>
                            </div>

                            <div className='moreOperationCont'>
                                <div className='actionOfPatientContainer'>
                                    <button className='moreOperation' onClick={handleOpenAddPatientModal}>
                                        הוספת מטופל חדש
                                    </button>
                                    <button className='moreOperation' onClick={handleOpenEmergencyModal}>
                                        התרעת חירום לרופא
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='roomsDetailsTableContainer'>
                    <div className='managmentTitle'>חדרים</div>

                    <RoomsTable ref={childRef} onSelectRoomInTable={handleSelectRoomInTable} />
                    <div className='moreOperationCont'>
                        <div className='actionOfPatientContainer'>
                            <button className='moreOperation' onClick={() => setIsRoomDeleteModalOpen(true)}>מחיקת חדר</button>
                            <button className='moreOperation' onClick={handleOpenAddRoomModal}>הוספת חדר</button>
                            <button className='moreOperation' onClick={() => childRef.current.handleToggleStatus()}>שנה סטטוס פעילות</button>
                        </div>
                    </div>
                </div>
                <Role />

            </div>

            <DeletePatientModal
                open={isDeleteModalOpen}
                handleClose={handleCloseDeleteModal}
                handleConfirm={handleConfirmDeleteModal}
                patientName={selectedPatient ? `${selectedPatient.FirstName} ${selectedPatient.LastName}` : ''}
            />
            <DeleteRoomModal
                open={isRoomDeleteModalOpen}
                handleClose={handleCloseRoomDeleteModal}
                handleConfirm={handleConfirmRoomDeleteModal}
                roomName={selectedRoomInTable ? `${selectedRoomInTable.Name}` : ''}
            />

            <EmergencyDoctorAlertModal
                open={isEmergencyModalOpen}
                handleClose={handleCloseEmergencyModal}
                handleConfirm={handleConfirmEmergencyModal}
                patientName={selectedPatient ? `${selectedPatient.FirstName} ${selectedPatient.LastName}` : ''}
                roomName={selectedRoomInTable ? selectedRoomInTable.Name : ''}
            />

            <AddPatientModal
                open={isAddPatientModalOpen}
                handleClose={handleCloseAddPatientModal}
                insert={insertPatient}
            />

            <AddRoomModal
                open={isAddRoomModalOpen}
                handleClose={handleCloseAddRoomModal}
            />
        </>
    );
};

export default QueueManagmentPage;
