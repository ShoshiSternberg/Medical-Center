import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarMenu from '../sidebar/sidebar.jsx'
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useParams } from 'react-router-dom';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import useRoomSocket from '../../clientServices/RoomSocket.js';
import './DoctorPage.css';
import { getAllRooms, getRoomById } from '../../clientServices/RoomService.js';
import EmergencyDoctorAlertModal from '../QueuesManagment/modals/EmergencyDoctorAlert.jsx';
import DeletePatientModal from '../QueuesManagment/modals/DeletePatient.jsx';
import Role from '../Role/role.jsx';
const DoctorPage = () => {



    const { id } = useParams();
    const [currentPatient, setCurrentPatient] = useState();
    const [nextPatient, setNextPatient] = useState();
    const [roomData, setRoomData] = useState({});
    const [rooms, setRooms] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State to manage the delete modal
    const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false); // State to manage the emergency modal
    const [roomButtons, setRoomButtons] = useState([]);

    const { moveRoom, emergencyAlertToDoctor, endOfTreatment, alertComponent } = useRoomSocket(id, currentPatient, setCurrentPatient, nextPatient, setNextPatient);

    const navigate = useNavigate();
    useEffect(() => {
        if (!sessionStorage.getItem('email')) {
            navigate('/');
        }
    }, []);

    const location = useLocation();
    const role = location.state;
    console.log(role)

    const getIconForRoom = (roomId) => {
        switch (roomId) {
            case 5:
                return <VaccinesIcon className='queueIcon' />;
            case 4:
                return <MonitorHeartIcon className='queueIcon' />;
            case 3:
                return <ZoomOutMapIcon className='queueIcon' />;
            case 2:
                return <VaccinesIcon className='queueIcon' />;
            case 1:
                return <VaccinesIcon className='queueIcon' />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const fetchAllRooms = async () => {
            try {
                const response = await getAllRooms();
                const fetchedRooms = response.data;
                setRooms(fetchedRooms);
                console.log(fetchedRooms);

                const roomData = fetchedRooms.find(room => room.ID === parseInt(id));
                setRoomData(roomData);
                console.log(roomData);

                const mappedRoomButtons = fetchedRooms.map(room => ({
                    roomId: room.ID,
                    icon: getIconForRoom(room.ID),
                    label: `העבר ל${room.Name}`
                }));

                setRoomButtons(mappedRoomButtons);
            } catch (error) {
                console.error('Error fetching rooms', error);
            }
        };

        fetchAllRooms();
    }, [id]);


    // Emergency Alert Handlers
    const handleConfirmEmergencyModal = () => {
        emergencyAlertToDoctor(currentPatient.UniqueNumber, roomData.Name);
        // alert('קריאת חירום נשלחה לרופא');
        handleCloseEmergencyModal();
    };

    const handleCloseEmergencyModal = () => {
        setIsEmergencyModalOpen(false);
    };

    const handleOpenEmergencyModal = () => {
        if (currentPatient == null) {
            alert("אין מטופל בחדר");
        }
        else
            setIsEmergencyModalOpen(true);
    };

    // Finish Treatment Handlers
    const handleFinishTreatment = async () => {
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDeleteModal = async () => {
        try {
            endOfTreatment(currentPatient.ID);
            alert('הטיפול הסתיים בהצלחה');
            handleCloseDeleteModal();

        } catch (error) {
            console.error('Error deleting patient:', error);
            alert('Failed to delete patient.');
        }
    };



    const anotherButtons = [
        { roomId: 1, icon: <CheckCircleIcon />, label: 'סיום טיפול', className: 'EndOfTreatment anotherButtons', onclick: handleFinishTreatment },
        { roomId: 2, label: 'התראת חירום לרופא ', className: 'emergencyAlert anotherButtons', onclick: handleOpenEmergencyModal }
    ];

    return (
        <div className='doctorPageContainer'>
            {role=== 2 && (<SidebarMenu role={role} />)}
            <div className='queuesCont'>
                <h2>חדר {roomData.Name}</h2>
                <div className='queueDetails'>
                    <div className='currentPatient'>
                        {currentPatient ? (
                            <>
                                <div className='patientNumber'>{currentPatient.UniqueNumber}</div>
                                <div className='patientName'>{currentPatient.FirstName} {currentPatient.LastName}</div>
                            </>
                        ) : (
                            <div className='noPatientMessage'>אין מטופל בחדר כרגע</div>
                        )}
                    </div>
                    <div className='nextPatient'>
                        {nextPatient ? (
                            <>
                                <span className='queueDetTitle'>מטופל הבא </span>
                                <div className='nextPatientNumber'>{nextPatient.UniqueNumber} : {nextPatient.FirstName} {nextPatient.LastName}</div>
                            </>
                        ) : (
                            <div className='noNextPatientMessage'>אין ממתינים</div>
                        )}
                    </div>
                </div>

                <div className='allQueues'>
                    <div className='queuesList'>
                        {roomButtons.map(button => (
                            button.roomId !== parseInt(id) && (
                                <button key={button.roomId} onClick={() => moveRoom(button.roomId)} className='moveQueue'>
                                    {button.icon}
                                    <span>{button.label}</span>
                                </button>
                            )
                        ))}
                    </div>
                </div>
                <div className='allQueues'>
                    <div className='queuesList'>
                        {anotherButtons.map(button => (
                            button.Id !== parseInt(id) && (
                                <button key={button.Id} className={button.className} onClick={button.onclick}>
                                    {getIconForRoom(button.ID)}
                                    <span>{button.label}</span>
                                </button>
                            )
                        ))}
                    </div>
                </div>
            </div>

            <DeletePatientModal
                open={isDeleteModalOpen}
                handleClose={handleCloseDeleteModal}
                handleConfirm={handleConfirmDeleteModal}
                patientName={currentPatient ? `${currentPatient.FirstName} ${currentPatient.LastName}` : ''}
            />

            <EmergencyDoctorAlertModal
                open={isEmergencyModalOpen}
                handleClose={handleCloseEmergencyModal}
                handleConfirm={handleConfirmEmergencyModal}
                patientName={currentPatient ? `${currentPatient.FirstName} ${currentPatient.LastName}` : ''}
                roomName={id ? roomData.Name : ''}
            />
            {alertComponent} {/* This renders the custom alert */}
            <div className='roleContainer'>
                <Role />
            </div>
        </div>
    );
};

export default DoctorPage;
