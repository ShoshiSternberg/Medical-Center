import React, { useState, useEffect } from 'react';
import './MonitorMessages.css';
import { getAllMessages } from '../../clientServices/MessagesService';

const MonitorMessages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getAllMessages();
                const activeMessages = response.data.data.filter(message => message.Status === true);
                setMessages(activeMessages);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    const activeMessages = messages.filter(message => message.Status);

    return (
        <>
            {messages.length > 0 && (
                <div className='messageDisplay'>
                    <div className='messagesMonitorTitle'>הודעות</div>

                    <div className='messagesMonitorContainer'>
                        <div className='messageList'>
                            {activeMessages.map(message => (
                                <div key={message.ID} className='messageItem'>
                                    {message.Message}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            )}
        </>
    );
};

export default MonitorMessages;
