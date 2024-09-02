import React, { useEffect, useState } from 'react';
import './MessagePage.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { updateMessage, deleteMessage, updateMessageStatus } from '../../clientServices/MessagesService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const MessageItem = ({ content, id, status, fetchAllMessages ,updateMessagesFromClient}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(content);
    const [activeOrPassive, setActiveOrPassive] = useState('');

    useEffect(() => {
        setActiveOrPassive(status ? 'הפוך ללא פעיל' : 'הפוך לפעיל');
    }, [status]);

    const handleDeleteMessage = async () => {
        const userConfirmed = window.confirm('האם אתה בטוח שברצונך למחוק הודעה זו?');
        if (userConfirmed) {
            try {
                await deleteMessage(id);
                updateMessagesFromClient();
                fetchAllMessages(); // Re-fetch messages after deletion
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const handleUpdateMessage = async () => {
        try {
            await updateMessage(id, newContent);
            updateMessagesFromClient();
            setIsEditing(false);
            fetchAllMessages(); // Re-fetch messages after updating
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const openEditWindow = () => {
        setIsEditing(true);
    };

    const closeEditWindow = () => {
        setIsEditing(false);
        setNewContent(content); // Reset content on cancel
    };

    const handleToggleStatus = async () => {
        try {
            await updateMessageStatus(id, !status);
            updateMessagesFromClient();
            fetchAllMessages(); // Re-fetch messages after updating status
        } catch (error) {
            console.error('Error updating message status:', error);
        }
    };

    return (
        <div className='MessageItemContainer'>
            {isEditing ? (
                <div className='messageContent'>
                    <input
                        type='text'
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className='messageContentInput'
                    />
                    <div className='updateBtnsContainer'>
                        <button className='updateBtns' onClick={handleUpdateMessage}>שמירה</button>
                        <button className='updateBtns' onClick={closeEditWindow}>ביטול</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className='messageContent'>{content}</div>
                    <div className='messagesActions'>
                        <button className='messageActivity-btn' onClick={handleToggleStatus}>

                            {activeOrPassive}
                            <div style={{marginRight:'5px'}}></div>

                            {status ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                        </button>
                        <button className='action-btn' onClick={openEditWindow}><EditIcon /></button>
                        <button className='action-btn' onClick={handleDeleteMessage}><DeleteIcon /></button>
                    </div>
                </>
            )}
        </div>
    );
};

export default MessageItem;
