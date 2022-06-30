import React from 'react';
import TimeAgo from "timeago-react";
import ProfileAvatar from '../Dashboard/ProfileAvatar';

const RoomItems = ( {roomInfo} ) => {

  const { name, createdAt, lastMessage } = roomInfo;
 
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h5 className='text-disappear'>{name}</h5>
        <TimeAgo
            datetime={ lastMessage ? new Date(lastMessage.createdAt) : new Date(createdAt)}
        />
      </div>
      <div className='d-flex align-items-center text-black-70'>    
        { lastMessage ? 
        <>
          <div className='d-flex align-items-center'>
            <ProfileAvatar name = {lastMessage.author.name} src = {lastMessage.author.avatar} />
          </div>
          <div className='text-disappear ml-2'>
            <div className='italic'>{lastMessage.author.name}</div>
            <span>{lastMessage.text || lastMessage.file.name}</span>
          </div>
        </> : <span>No messages yet</span>  } 
      </div>
    </div>
  )
}

export default RoomItems;
