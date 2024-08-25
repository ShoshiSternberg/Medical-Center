import React from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Role from '../Role/role';

import './HomePage.css'
const HomePage = () => {


  const navigate = useNavigate();

  const goToPagesNavigate = () => {
    navigate('/userLogin');
  };
  return (
    <>
      <div className='HomePageContainer'>

        <button className='pagesNavigate-btn' onClick={goToPagesNavigate}><ArrowBackIcon />
          <span className='pagesNavigate-text'>
            מכאן מתחילים
          </span>
        </button> 
        <Role />

      </div>
    </>
  );
};

export default HomePage;
