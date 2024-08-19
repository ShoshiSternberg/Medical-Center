import React, { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';
import MessageIcon from '@mui/icons-material/Message';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonitorIcon from '@mui/icons-material/Monitor';

import './sidebar.css'

function SidebarMenu({ role }) {

  const [collapsed, setCollapsed] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('email')) {
      navigate('/pagesNavigate');
    }
  }, []);

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const goToHomePage = () => {
    navigate('/pagesNavigate');
  };


  const goToUsersPage = () => {
    navigate('/users');
  };

  const goToMessagesPage = () => {
    navigate('/messages');
  };


  const goToMonitorPage = () => {
    navigate('/monitor');
  };

  const goToQueueManagmentPage = () => {
    navigate('/QueueManagment');
  };

  const goToReportsPage = () => {
    navigate('/reports');
  };
  return (
    <div className='sidebarContainer'>
      <Sidebar className='sidebar' rtl={true} collapsed={collapsed} style={{ height: "100vh" }}>
        <Menu >
          <MenuItem icon={<Home className='icon' />} onClick={goToHomePage}>בית</MenuItem>
          {role === 1 && (
            <MenuItem icon={<PeopleAltIcon className='icon' />} onClick={goToUsersPage}>משתמשים</MenuItem>
          )}
          <MenuItem icon={<MeetingRoomIcon className='icon' />} onClick={goToQueueManagmentPage}>ניהול תורים</MenuItem>
          <MenuItem icon={<MessageIcon className='icon' />} onClick={goToMessagesPage}>הודעות</MenuItem>
          <MenuItem icon={<AssessmentIcon className='icon' />} onClick={goToReportsPage}>ניתוח נתונים</MenuItem>
          <MenuItem icon={<MonitorIcon className='icon' />} onClick={goToMonitorPage}>מוניטור</MenuItem>
        </Menu>
        <button className='menu-btn' onClick={handleToggleSidebar}>תפריט</button>
      </Sidebar>
    </div>
  );
}

export default SidebarMenu;