import React from 'react'
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import { CurrentRoomProvider } from '../../Context/CurrentRoomContext';
import { useRooms } from '../../Context/RoomsContext';
import BottomWindow from '../../My Components/Chat-Window/Bottom-Window';
import MessageWindow from '../../My Components/Chat-Window/Message-Window';
import TopWindow from '../../My Components/Chat-Window/Top-Window';

const Chat = () => {

  const { chatID } = useParams();  
  const rooms = useRooms();

  if (!rooms) {
    return <Loader center vertical size = "md" content = "Loading" speed='slow' />
  }

  const currentRoom = rooms.find(room => room.id === chatID);
  if (!currentRoom) {
    return <h6 className='text-center mt-page'>Chat {chatID} not found</h6>
  }

  const { name, description } = currentRoom;     // destructuring name and description from currentRoom
  const currentRoomData = {
    name, description
  }

  return (
    <CurrentRoomProvider data = {currentRoomData} >
      <div className='chat-top'>
        <TopWindow />
      </div>
      <div className='chat-middle'>
        <MessageWindow />  
      </div>
      <div className='chat-bottom'>
        <BottomWindow />
      </div>
    </CurrentRoomProvider>

  )
}

export default Chat;
