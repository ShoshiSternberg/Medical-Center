import React, { useEffect } from 'react';
import SidebarMenu from '../sidebar/sidebar'
import './AdminPage.css'
import { useLocation, useNavigate } from 'react-router-dom';
import Role from '../sidebar/role';
import '../HomePage/pagesNavigate/pagesNavigate.css';

const AdminPage = () => {

    const location = useLocation();
    const role = location.state;

    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem('email')) {
            navigate('/pagesNavigate');
        }
    }, []);

    return (
        <>
            <div className='AdminPageContainer' style={{ direction: "rtl" }}>
                <SidebarMenu role={role} />
                <div>ניהול מערכת</div>
                <div>
                    <div>עדכון אחרון</div>
                    <div>15-02-2024 14:32</div>
                </div>
                <div className='roleContainer'>
                    <Role />
                </div>
            </div>
        </>

    );
};

export default AdminPage;
