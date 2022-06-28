import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { database } from '../../../Misc/firebase';
import { TransformToArray } from '../../../Misc/Helpers';
import MessageItem from './MessageItem';

const MessageWindow = () => {

  const { chatID } = useParams();
  const [message , setMessage] = useState(null);

  const isChatEmpty = message && message.length === 0;
  const canShowMessage = message && message.length > 0;
  let alertMsg = '';

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

  const handleAdminPerm = useCallback( async (uid) => {

    const adminsRef = database.ref(`/rooms/${chatID}/admins`);
    await adminsRef.transaction(admins => {
      if (admins) {
        if (admins[uid]) {
          admins[uid] = null;
          // eslint-disable-next-line react-hooks/exhaustive-deps
          alertMsg = 'Admin permission removed';
        }
      } 
      else {
        admins[uid] = true;
        alertMsg = 'Admin permission granted'
      }

      return admins;
    });

    Alert.info(alertMsg, 4000);

  }, [chatID]);

  return (
    <ul className='msg-list custom-scroll'>
      { isChatEmpty && <li>No messages yet</li> }
      {canShowMessage && message.map(msg => <MessageItem key = {msg.id} message = {msg} handleAdminPerm = {handleAdminPerm} />)}
    </ul>
  )
}

export default MessageWindow;
