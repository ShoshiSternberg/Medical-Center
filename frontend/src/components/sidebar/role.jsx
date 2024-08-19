import React from 'react';
import '../HomePage/pagesNavigate/pagesNavigate.css';

function Role() {

    return (
        <div className='page-btn role'>
            Role : {sessionStorage.getItem('role')}
        </div>
    );
}

export default Role;