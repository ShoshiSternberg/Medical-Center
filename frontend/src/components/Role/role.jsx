import React from 'react';
import './role.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

function Role() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/userLogin');
    };
    return (
        <div className='roleContainer'>

            <div className='roleDetailCont'>
                <div className='roleDetail'>
                    <AccountCircleIcon />
                    <div className='roleDetailName'>{sessionStorage.getItem('name')}</div>
                    , <span>&nbsp;</span>
                    <div className='roleDetailRole'>
                        {sessionStorage.getItem('role')}

                    </div>
                </div>

                <button className='logout-btn' onClick={handleLogout}>יציאה</button>

            </div>

        </div>
    );
}

export default Role;