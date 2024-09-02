import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../../../clientServices/RoomService';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarMenu from '../../sidebar/sidebar'

import './pagesNavigate.css';
import Role from '../../Role/role';

const PagesNavigation = () => {
  const [rooms, setRooms] = useState([]);

  const location = useLocation();
  const role = location.state;
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getAllRooms();
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const navigate = useNavigate();

  const goToAdminPage = () => {
    navigate('/admin', { state: role });
  };

  const goToUserLoginPage = () => {
    navigate('/userLogin');
  };

  const goToPatientEnterPage = () => {
    navigate('/patientEnter');
  };

  const goToDoctorPage = (id) => {
    navigate(`/doctorPage/${id}`, { state: role });
  };

  const goToMonitorPage = () => {
    navigate('/monitor');
  };

  return (
    <>
      <div className='PagesNavigationContainer'>
        {(role===1||role===2)&&<SidebarMenu role={role} />}

        <div className='pagesContainerContainer'>
          <div className='pagesContainerTitle'>בחירת עמוד</div>
          <div className='pagesContainer'>
            <h3>בחר עמוד שברצונך להיכנס אליו:</h3>
            <div className='pagesBtnsContainer'>
              {/* {role === 1 && (<button onClick={goToAdminPage} className='page-btn'>מנהל</button>)} */}
              {/* {(role === 1 || role === 2) && (<button onClick={goToUserLoginPage} className='page-btn'>כניסת משתמש</button>)} */}
              {(role === 1 || role === 2) && (<button onClick={goToPatientEnterPage} className='page-btn'>תור חדש</button>)}
              {(role === 1 || role === 2) && (<button className='page-btn' onClick={goToMonitorPage}>מוניטור</button>)}
              {rooms.map(room => (
                (role === 1 || role === 2 || room.Name !== "קבלה") && (
                  <button
                    key={room.ID}
                    onClick={() => goToDoctorPage(room.ID)}
                    className='page-btn'
                  >
                    {room.Name}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
        <Role />
    </>
  );
};

export default PagesNavigation;