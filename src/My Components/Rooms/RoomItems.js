import React from 'react';
import TimeAgo from "timeago-react";

const RoomItems = ( {roomInfo} ) => {
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h5 className='text-disappear'>{roomInfo.name}</h5>
        <TimeAgo
            datetime={new Date(roomInfo.createdAt)}
        />
      </div>
      <div className='d-flex align-items-center text-black-70'>    
        <span>No messages yet</span>   
      </div>
    </div>
  )
}

export default RoomItems;
