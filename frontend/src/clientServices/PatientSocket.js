import { useState, useEffect, useRef } from 'react';
import socketIO from 'socket.io-client';

const useSocket = (setPatientDetails) => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = socketIO(process.env.REACT_APP_SERVICE_URL, {
            query: { clientId: "PatientEnter" }
        });

        socketRef.current.on("message", (message) => {
            alert(message);
            console.log(message);
        });

        socketRef.current.on("patientInserted", (patientDetails) => {
            console.log(patientDetails);
            setPatientDetails(patientDetails);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const insertPatient = (firstName,lastName,HMOid,phone,tz) => {
        try {            
                socketRef.current.emit("insertPatient", firstName,lastName,HMOid,phone,tz,0);
                console.log("insert patient",tz);
        } catch (error) {
            console.log(error);
        }
    }

    return { insertPatient };
};

export default useSocket;
