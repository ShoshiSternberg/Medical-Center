import { useState, useEffect, useRef } from 'react';
import socketIO from 'socket.io-client';
import CustomAlert from './CustomAlert';

const useRoomSocket = (roomId, currentPatient, setCurrentPatient, nextPatient, setNextPatient) => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const socketRef = useRef(null);

    const handleAlertClose = () => {
        setAlertOpen(false);
    };

    useEffect(() => {

        socketRef.current = socketIO("http://localhost:8000", {
            query: { clientId: roomId }
        });

        socketRef.current.on("updateCurrentPatient", (newPatient) => {
            setCurrentPatient(newPatient);
            console.log("current patient", newPatient);
        });

        socketRef.current.on("updateNextPatient", (newPatient) => {
            setNextPatient(newPatient);
            console.log("next patient", newPatient);
        });

        socketRef.current.on("message", (message) => {
            setAlertMessage(message);
            setAlertOpen(true);
            console.log(message);
        });
        socketRef.current.on("Emergencymessage", (message) => {
            setAlertMessage(message);
            setAlertOpen(true);
             console.log(message);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId]);

    const moveRoom = (roomId) => {
        try {
            if (currentPatient == null) {
                alert("אין מטופל בחדר");
                console.log("not valid");
            }
            else {
                console.log("move client ", currentPatient.ID, " to room ", roomId);
                const place = true;
                socketRef.current.emit("moveClientToAnotherRoom", currentPatient.ID, roomId, place);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const emergencyAlertToDoctor = (patientId, roomId) => {
        try {
            if (patientId == null || roomId == null)
                alert("not valid");
            else {
                console.log("emergencyAlertToRoom", roomId, "for patient ", patientId);
                socketRef.current.emit("EmergencyAlertToRoom", roomId, patientId);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const endOfTreatment = (patientId) => {
        try {
            if (patientId != null) {
                socketRef.current.emit("deletePatient", patientId);
                console.log("end of treatment of patient: ", patientId);
            }
            else {
                alert("not valid");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return {
        emergencyAlertToDoctor,
        endOfTreatment,
        currentPatient,
        nextPatient,
        moveRoom,
        alertComponent: <CustomAlert open={alertOpen} onClose={handleAlertClose} message={alertMessage} />
    };
};

export default useRoomSocket;
