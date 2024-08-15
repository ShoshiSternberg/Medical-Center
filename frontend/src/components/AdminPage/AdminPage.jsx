import React, { useEffect } from 'react';
import SidebarMenu from '../sidebar/sidebar'
import './AdminPage.css'
import { useLocation, useNavigate } from 'react-router-dom';
const AdminPage = () => {

    const location = useLocation();
    const role = location.state;
    console.log(role)
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem('email')) {
            navigate('/userLogin');
        }
    }, []);

    return (
        <>
            {sessionStorage.getItem('email') ? (
                <div className='AdminPageContainer' style={{ direction: "rtl" }}>
                    <SidebarMenu role={role} />
                    <div>ניהול מערכת</div>
                    <div>
                        <div>עדכון אחרון</div>
                        <div>15-02-2024 14:32</div>
                    </div>
                </div>
            ) : (
                <div>Redirecting...</div>
            )}
        </>

    );
};

export default AdminPage;
