import React from 'react'
import CreateRoomModel from './CreateRoomModel';
import DashboardToggle from './Dashboard/DashboardToggle';

const SideBar = () => {
  return (
    <div className='h-100 pt-2'>
        <div>
            <DashboardToggle />
            <CreateRoomModel />
        </div>
        bottom
    </div>
    
  )    
}

export default SideBar;
