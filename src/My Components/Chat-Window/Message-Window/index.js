import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { database } from '../../../Misc/firebase';
import { TransformToArray } from '../../../Misc/Helpers';
import MessageItem from './MessageItem';

const MessageWindow = () => {

  const { chatID } = useParams();
  const [message , setMessage] = useState(null);

  const isChatEmpty = message && message.length === 0;
  const canShowMessage = message && message.length > 0;

  useEffect(() => {

    const messageRef = database.ref('/messages');
    messageRef.orderByChild('roomId').equalTo(chatID).on('value', (snapshot) => {
      const data = TransformToArray(snapshot.val());
      setMessage(data);
    })

    return () => {
      messageRef.off('value');
    }

  }, [chatID]);

  return (
    <ul className='msg-list custom-scroll'>
      { isChatEmpty && <li>No messages yet</li> }
      {canShowMessage && message.map(msg => <MessageItem key = {msg.id} message = {msg} />)}
    </ul>
  )
}

export default MessageWindow;
