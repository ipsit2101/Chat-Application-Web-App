import React, { useCallback, useState } from 'react'
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/app';
import { useProfile } from '../../../Context/profileContext';
import { useParams } from 'react-router';
import { database } from '../../../Misc/firebase';
import Attachments from './Attachments';

function assembleMessage(profile, chatID) {
  return {
    roomId: chatID,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? {avatar: profile.avatar} : {})
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0
  }
}  

const BottomWindow = () => {

  const [input, setInput] = useState('');   
  const { profile } = useProfile();
  const { chatID } = useParams();
  const [isLoading, setIsLoading] = useState(false);  // Loading Spinner

  const onInputChange = useCallback((value) => {  // onChange handler in rsuite gives us the value as first argument instead on event handler
    setInput(value);
  }, []);

  const onSendClick = async () => {

      if (input.trim() === '') return; // check if the message is empty

      const MessageData = assembleMessage(profile, chatID);
      MessageData.text = input;

      const updates = {};

      //push() generates a new child location using a unique key and returns its Reference.
      //This is the most common pattern for adding data to a collection of items.
      //If you provide a value to push(), the value is written to the generated location. If you don't pass a value, nothing is written to the database and the child remains empty (but you can use the Reference elsewhere).
      const messageId = database.ref('messages').push().key;

      //updating update object
      updates[`/messages/${messageId}`] = MessageData;
      updates[`/rooms/${chatID}/lastMessage`] = {
        ...MessageData,  
        msgId: messageId
      }

      // updating database
      setIsLoading(true);
      try {
        await database.ref().update(updates);
        setInput('');
        setIsLoading(false);
      } catch (error) {

        setIsLoading(false);
        Alert.error(error.message, 4000);
      }
  }

  const onKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      onSendClick();  
    }
  }
  
  const afterUpload = useCallback((files) => {
    setIsLoading(true);

    const updates = {};
    files.forEach(file => {

      const MessageData = assembleMessage(profile, chatID);
      MessageData.text = input;
      
      const messageId = database.ref('messages').push().key;
      //updating update object
      updates[`/messages/${messageId}`] = MessageData;

    })

  }, []);

  return (
    <>
      <InputGroup>
        <Attachments afterUpload = {afterUpload} />
        <Input placeholder = "Write a new message here..." value = {input} onChange = {onInputChange} />
        <InputGroup.Button color='green' appearance='primary' onClick = {onSendClick} onKeyDown = {onKeyDown} disabled = {isLoading}>
          <Icon icon = "send" />
        </InputGroup.Button>
      </InputGroup>
    </>
  )
}

export default BottomWindow;  
