import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';
import MessageIcon from '@mui/icons-material/Message';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonitorIcon from '@mui/icons-material/Monitor';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import './sidebar.css'

function SidebarMenu(props) {
  const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const goToHomePage = () => {
    navigate('/pagesNavigate', { state: props.role });
  };


  const goToUsersPage = () => {
    navigate('/users', { state: props.role });
  };

  const goToMessagesPage = () => {
    navigate('/messages', { state: props.role });
  };


  const goToMonitorPage = () => {
    navigate('/monitor', { state: props.role });
  };

  const goToQueueManagmentPage = () => {
    navigate('/QueueManagment', { state: props.role });
  };

  const goToReportsPage = () => {
    navigate('/reports', { state: props.role });
  };

  const goToPagesNavigation = () => {
    navigate('/pagesNavigate', { state: props.role });
  };

  const goToReceptionRoom =()  => {
    navigate('/doctorPage/1', { state: props.role });
  };

  return (
    <div className='sidebarContainer'>
      <Sidebar className='sidebar' rtl={true} collapsed={collapsed} style={{ height: "100vh" }}>
        <Menu >
        {props.role === 1 && ( <MenuItem icon={<Home className='icon' />} onClick={goToHomePage}>בית</MenuItem>)}
        {props.role === 2 && ( <MenuItem icon={<Home className='icon' />} onClick={goToReceptionRoom}>בית</MenuItem>)}


          {props.role === 1 && (
            <MenuItem icon={<PeopleAltIcon className='icon' />} onClick={goToUsersPage}>משתמשים</MenuItem>
          )}
          <MenuItem icon={<MeetingRoomIcon className='icon' />} onClick={goToQueueManagmentPage}>ניהול תורים</MenuItem>
          <MenuItem icon={<MessageIcon className='icon' />} onClick={goToMessagesPage}>הודעות</MenuItem>
          <MenuItem icon={<AssessmentIcon className='icon' />} onClick={goToReportsPage}>ניתוח נתונים</MenuItem>
          <MenuItem icon={<MonitorIcon className='icon' />} onClick={goToMonitorPage}>מוניטור</MenuItem>
          <MenuItem icon={<AddCircleIcon className='icon' />} onClick={goToPagesNavigation}>עמודים נוספים</MenuItem>

        </Menu>
        <button className='menu-btn' onClick={handleToggleSidebar}>תפריט</button>
      </Sidebar>
    </div>
  );
}

export default SidebarMenu;