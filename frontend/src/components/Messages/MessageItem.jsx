import React, { useEffect, useState } from 'react';
import './MessagePage.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { updateMessage, deleteMessage } from '../../clientServices/MessagesService';

const MessageItem = ({ content, id, onMessageUpdated, status }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(content);
    const [activeOrPassive, setActiveOrPassive] = useState('')

    useEffect(() => {
        setActiveOrPassive(status ? 'הפוך ללא פעיל' : 'הפוך לפעיל');
    }, [status]);
    const handleDeleteMessage = async () => {
        const userConfirmed = window.confirm('האם אתה בטוח שברצונך למחוק הודעה זו?');
        if (userConfirmed) {
            try {
                await deleteMessage(id);
                onMessageUpdated(); // Call the callback to refresh the message list
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    const handleUpdateMessage = async () => {
        try {
            await updateMessage(id, { message: newContent });
            setIsEditing(false);
            onMessageUpdated(); // Call the callback to refresh the message list
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
            ) : (<>
                <div className='messageContent'>{content}</div>
                <div className='messagesActions'>
                    <button className='messageActivity-btn'>{activeOrPassive} </button>
                    <button className='action-btn' onClick={openEditWindow}><EditIcon /></button>
                    <button className='action-btn' onClick={handleDeleteMessage}><DeleteIcon /></button>
                </div>
            </>
            )}

        </div>
    );
};

export default MessageItem;