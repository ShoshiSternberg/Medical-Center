import React, { useState, useEffect } from 'react';
import './MessagePage.css';
import MessageItem from './MessageItem';
import { getAllMessages } from '../../clientServices/MessagesService';
import NewMessageModal from './NewMessageModal';
import Sidebar from '../sidebar/sidebar';
import Role from '../sidebar/role';


const MessagePage = () => {
    const [allMessages, setAllMessages] = useState([]);
    const [isAddMessageModalOpen, setIsAddMessageModalOpen] = useState(false);


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

    const handleOpenAddMessagModal = () => {
        setIsAddMessageModalOpen(true);
    };

    const handleCloseAddMessageModal = () => {
        fetchAllMessages();
        setIsAddMessageModalOpen(false);
    };

    return (
        <>
            <div className='MessagePageContainer'>
                <Sidebar />

                <>
                    <div className='titleAndNewMessage'>
                        <h2>הודעות מערכת</h2>

                        <button className='newMsg-Btn' onClick={handleOpenAddMessagModal}>הודעה חדשה</button>
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
                                />
                            ))
                        ) : (
                            <p>לא נמצאו הודעות</p>
                        )}
                    </div>
                </>

            </div>
            <NewMessageModal
                open={isAddMessageModalOpen}
                handleClose={handleCloseAddMessageModal}
            />
            <div className='roleContainer'>
                <Role />
            </div>
        </>
    );
};

export default MessagePage;
