import { useState, useEffect, useRef } from 'react';
import socketIO from 'socket.io-client';

const useReceptionSocket = (setSelectedPatient, patients, setPatients) => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = socketIO("http://localhost:8000", {
            query: { clientId: "reception" }
        });

        socketRef.current.on("queueUpdate", (updatedAppointment) => {
            console.log("queue update", updatedAppointment);
            setPatients(patients =>
                patients
                    .map(patient => patient.ID === updatedAppointment.ID ? updatedAppointment : patient)
                    .filter(patient => patient.LastName!=undefined)
            );
            if (updatedAppointment.LastName)
                setSelectedPatient(updatedAppointment);
        });

        socketRef.current.on("message", (message) => {
            console.log(message);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [patients]);

    const moveRoom = (roomId, patientId, place) => {
        try {
            if (patientId == null)
                alert("not valid");
            else {
                console.log("move client ", patientId, " to room ", roomId);
                socketRef.current.emit("moveClientToAnotherRoom", patientId, roomId, place);
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

    return { moveRoom, emergencyAlertToDoctor, endOfTreatment };
};

export default useReceptionSocket;