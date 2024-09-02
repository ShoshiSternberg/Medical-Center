import React, { useEffect } from 'react';
import './RoomMonitorQueue.css';

const RoomMonitorQueue = ({ id, name, subscribeToRoom, queuesByRoom ,socket}) => {
    const queue = queuesByRoom[id] || [];
    useEffect(() => {
    subscribeToRoom(id);
}, [subscribeToRoom, id]);

    return (
        <div className='RoomMonitorQueueContainer'>
            <div className='roomMonitorTitle'>{name}</div>
            {queue.length > 0 ? (
                <>
                    <div className='currentMonitorPatient'>
                        <div className='currentPatientNumber'>
                            {queue[0] && <div>{queue[0].patient.UniqueNumber}</div>}
                        </div>
                    </div>
                    <div className='nextPatientsContainer'>
                        <div className='next3MonitorPatients'>
                            <div>הבאים בתור:</div>
                            {queue[1] && <div className='next'>{queue[1].patient.UniqueNumber}</div>}
                            {queue[2] && <div className='next'> {queue[2].patient.UniqueNumber}</div>}
                            {queue[3] && <div className='next'>{queue[3].patient.UniqueNumber}</div>}
                        </div>
                    </div>
                    <div className='numOfWaitPatientsContainer'>
                        <div>מספר ממתינים</div>
                        {/* decrease the current patient */}
                        <div className='numOfWaitPatients'>{queue.length-1}</div>  
                    </div>
                </>
            ) : (
                <p>אין ממתינים</p>
            )}
        </div>
    );
};

export default RoomMonitorQueue;