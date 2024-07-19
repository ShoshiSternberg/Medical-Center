import React, { useState, useEffect } from 'react';
import './MonitorPage.css';
import RoomMonitorQueue from './roomMonitorQueue';
import { getAllRooms } from '../../clientServices/RoomService';
import useMonitorSocket from '../../clientServices/MonitorSocket';
import MonitorMessages from './MonitorMessages';
import background from "./background.jpg";

const MonitorPage = () => {
    const [rooms, setRooms] = useState([]);
    const socketUrl = "http://localhost:8000";  // Replace with your server address
    const { subscribeToRoom, queuesByRoom,socket } = useMonitorSocket(socketUrl);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        console.log("monitorPage");
        const fetchRooms = async () => {
            try {
                const response = await getAllRooms();
                console.log(response.data);
                const activeRooms = response.data.filter(room => room.Status === true);
                setRooms(activeRooms);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();


        const updateDate = () => {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = now.toLocaleDateString('he-IL', options);
            setCurrentDate(formattedDate);
        };

        updateDate();
        const intervalId = setInterval(updateDate, 60000); // Update every minute

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
        <div className='monitorPageContainerFull' style={{ backgroundImage: `url(${background})`, backgroundSize: '100%' }}>
            <div className='monitorPageContainer' >
                <MonitorMessages />

                <div className='queuesRoomsMonitorContainer'>
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <div key={room.ID} className='roomMonitorContainer'>
                                <RoomMonitorQueue id={room.ID}
                                name={room.Name}
                                subscribeToRoom={subscribeToRoom}
                                queuesByRoom={queuesByRoom}
                                socket={socket} />
                            </div>
                        ))
                    ) : (
                        <p>No rooms available.</p>
                    )}
                </div>

            </div>
            <div className='dateDisplay'>{currentDate}</div>
        </div>
    );
};

export default MonitorPage;
