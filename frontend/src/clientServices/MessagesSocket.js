import { useEffect, useRef } from 'react';

import socketIO from 'socket.io-client';

const useMessagesSocket = () => {

    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = socketIO("http://localhost:8000", {
            query: { clientId: "messagesPage" }
        });

        // socketRef.current.on("messageUpdated", (allMessages) => {
        //      console.log(allMessages)
        //      setAllMessages(previous => [...previous, allMessages])
        // });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const updateMessagesFromClient = () => {
        try {
            socketRef.current.emit("messageUpdated");
            console.log("update message emit to server");
        } catch (error) {
            console.log(error);
        }
    };

    return { updateMessagesFromClient };
};

export default useMessagesSocket;
