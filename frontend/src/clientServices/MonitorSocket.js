import { useState, useEffect, useCallback } from 'react';
import socketIO from 'socket.io-client';

const useMonitorSocket = (messages,setMessages) => {
    const [socket, setSocket] = useState(null);
    const [queuesByRoom, setQueuesByRoom] = useState({});

    useEffect(() => {
        const newSocket = socketIO(process.env.REACT_APP_SERVICE_URL, {
            query: { clientId:"monitor" }
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        newSocket.on('disconnect', (reason) => {
            console.log('Disconnected from WebSocket server:', reason);
        });

        newSocket.on(`queueUpdate`, (roomId, newQueue ) => {
            console.log("queue update in client");            
            setQueuesByRoom(prevQueues => ({
                ...prevQueues,
                [roomId]: newQueue
            }));
        });

        newSocket.on(`messageUpdated`,(message)=>{
            console.log("updateMessages",message);
            const activeMessages = message.filter(message => message.Status === true);
            setMessages(activeMessages);
        });

        // Clean up on component unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const subscribeToRoom = useCallback((roomId) => {
        if (socket&&!queuesByRoom[roomId]) {
            console.log(`Subscribing to room ${roomId}`);
            socket.emit('subscribeToQueue', roomId);
        }
    },[socket]);

    return { subscribeToRoom, queuesByRoom,socket,messages };
};

export default useMonitorSocket;