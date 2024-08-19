import React, { useState, useEffect } from 'react';

import { getAllRooms } from '../../clientServices/RoomService';
import { useNavigate } from 'react-router-dom';

import '../HomePage/pagesNavigate/pagesNavigate.css';
import Role from '../sidebar/role';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);

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

  const goToDoctorPage = (id) => {
    navigate(`/doctorPage/${id}`);
  };

  return (
    <>
      <div className='pagesContainer'>
        <h2>בחר עמוד</h2>
        <div className='pagesBtnsContainer'>
          {rooms.map(room => (
            <button
              key={room.ID}
              onClick={() => goToDoctorPage(room.ID)}
              className='page-btn'
            >
              {room.Name}
            </button>
          ))}
        </div>
        <div className='roleContainer'>
          <Role />
        </div>
      </div>
    </>
  );
};

export default RoomsPage;



