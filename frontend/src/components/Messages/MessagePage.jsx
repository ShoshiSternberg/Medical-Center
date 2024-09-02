import React, { useState, useEffect } from 'react';
import './MessagePage.css';
import MessageItem from './MessageItem';
import { getAllMessages } from '../../clientServices/MessagesService';
import NewMessageModal from './NewMessageModal';
import Sidebar from '../sidebar/sidebar';
import useMessagesSocket from '../../clientServices/MessagesSocket';
import { useLocation } from 'react-router-dom';
import Role from '../Role/role';


const MessagePage = () => {
    const [allMessages, setAllMessages] = useState([]);
    const [isAddMessageModalOpen, setIsAddMessageModalOpen] = useState(false);
    const { updateMessagesFromClient } = useMessagesSocket();

    const location = useLocation();
    const role = location.state;

    const fetchAllMessages = async () => {
        try {
            const response = await getAllMessages();
            setAllMessages(response.data.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchAllMessages();
    }, []);

    const handleOpenAddMessageModal = () => {
        setIsAddMessageModalOpen(true);
    };

    const handleCloseAddMessageModal = () => {
        fetchAllMessages();
        setIsAddMessageModalOpen(false);
    };

    return (
        <>
            <div className='MessagePageContainer'>
                <Sidebar role={role} />

                <>
                    <div className='titleAndNewMessage'>
                        <h2>הודעות מערכת</h2>

                        <button className='newMsg-Btn' onClick={handleOpenAddMessageModal}>הודעה חדשה</button>
                    </div>


                    <div className='allMessagesContainer'>
                        {Array.isArray(allMessages) && allMessages.length > 0 ? (
                            allMessages.map((message) => (
                                <MessageItem
                                    key={message.ID}
                                    id={message.ID}
                                    content={message.Message}
                                    status={message.Status}
                                    fetchAllMessages={fetchAllMessages}
                                    updateMessagesFromClient={updateMessagesFromClient}
                                />
                            ))
                        ) : (
                            <p>לא נמצאו הודעות</p>
                        )}
                    </div>
                </>
                <Role />

            </div>
            <NewMessageModal
                open={isAddMessageModalOpen}
                handleClose={handleCloseAddMessageModal}
                updateMessagesFromClient={updateMessagesFromClient}
            />
        </>
    );
};

export default MessagePage;
