import React, { useEffect, useRef, useState } from 'react'
import { Divider } from 'rsuite';
import CreateRoomModel from './CreateRoomModel';
import DashboardToggle from './Dashboard/DashboardToggle';
import ChatRoomsList from './Rooms/ChatRoomsList';

const SideBar = () => {
  const topSideBarRef = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (topSideBarRef.current) {
      setHeight(topSideBarRef.current.scrollHeight);
    }
  }, [topSideBarRef]);

  return (
    <div className='h-100 pt-2'>  
        <div ref = {topSideBarRef}>

            <DashboardToggle />
            <CreateRoomModel />
            <Divider>join conversation</Divider>

        </div>
        <ChatRoomsList aboveEleHeight = {height} />
    </div>
    
  )    
}

export default SideBar;
