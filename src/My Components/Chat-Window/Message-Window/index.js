import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Alert, Button } from "rsuite";
import { auth, database, storage } from "../../../Misc/firebase";
import { groupBy, TransformToArray } from "../../../Misc/Helpers";
import MessageItem from "./MessageItem";

const PAGE_SIZE = 8;
const messageRef = database.ref("/messages");

const MessageWindow = () => {   
  const { chatID } = useParams();    
  const [message, setMessage] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE); 

  const selfRef = useRef();   // to make sure that we're scrolled to the very bottom while loading messages

  const isChatEmpty = message && message.length === 0;
  const canShowMessage = message && message.length > 0;
  let alertMsg = "";

  const loadMessages = useCallback((limitToLast) => {

    messageRef.off();

    messageRef.orderByChild("roomId").equalTo(chatID).limitToLast(limitToLast || PAGE_SIZE).on("value", (snapshot) => {
      const data = TransformToArray(snapshot.val());
      setMessage(data);
      //console.log('Messages', message);
    });

    setLimit(prevLim => prevLim + PAGE_SIZE);

  }, [chatID]);

  const onLoadMoreMessages = useCallback(() => {

    loadMessages(limit);

  }, [loadMessages, limit]);      
    
  useEffect(() => {                       

    const node = selfRef.current;
    loadMessages();  // When we load our messages initially

    setTimeout(() => {
      node.scrollTop = node.scrollHeight  // to make sure that we're scrolled to the very bottom while loading messages
    }, 1000);

    return () => {
      messageRef.off("value");
    };
  }, [loadMessages]);

  const handleAdminPerm = useCallback(
    async (uid) => {
      const adminsRef = database.ref(`/rooms/${chatID}/admins`);
      await adminsRef.transaction((admins) => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            // eslint-disable-next-line react-hooks/exhaustive-deps
            alertMsg = "Admin permission removed";
          }
        } else {
          admins[uid] = true;
          alertMsg = "Admin permission granted";
        }

        return admins;
      });

      Alert.info(alertMsg, 4000);
    },
    [chatID]
  );

  const MessageLikeHandler = useCallback( async (msgId) => {

    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);
      await messageRef.transaction((msg) => {
        if (msg) {
          if (msg.likes && msg.likes[uid]) {
            msg.likeCount--;
            msg.likes[uid] = null;
            // eslint-disable-next-line react-hooks/exhaustive-deps
            alertMsg = "Like removed";
          }
          else {
              msg.likeCount++;
              if (!msg.likes) {
                msg.likes = {}; 
              }
              msg.likes[uid] = true;
              alertMsg = "Like added";
          } 
        }

        return msg;
      });

      Alert.info(alertMsg, 4000);

  }, []);

  const MessageDeleteHandler = useCallback(async (msgId, file) => {

    if (!window.confirm('Delete this message')) {
      return;
    }

    const isLast = message[message.length-1].id === msgId;  // checks if the message that the current user deletes is the last message
    const updates = {};
    updates[`/messages/${msgId}`] =null;

    if (isLast && message.length > 1) {
      updates[`/rooms/${chatID}/lastMessage`] = {
        ...message[message.length-2],
        msgId: message[message.length-2].id        
      }
    }
    if (isLast && message.length === 1) {
      updates[`/rooms/${chatID}/lastMessage`] = null;
    }

    try {
      await database.ref().update(updates);
      Alert.info('Message is deleted', 4000);
    } catch (error) {
      return Alert.error(error.message, 4000);
    }

    if (file) {  // if file exists
      try {

        const fileRef = storage.refFromURL(file.url);
        await fileRef.delete();
        
      } catch (error) {
        Alert.error(error.message, 4000);   
      }
    }
  
  }, [chatID, message]);

  const RenderMessages = () => {        // Renders messages in message window

    const group = groupBy(message, (item) => new Date(item.createdAt).toDateString());

    const items = [];
    Object.keys(group).forEach((date) => {

      items.push(
        <li key = {date} className="text-center mb-1 padded">{date}</li>
      )
      const messageArrays = group[date].map(msg => {
        return (
          <MessageItem    
            key={msg.id}
            message={msg}
            handleAdminPerm={handleAdminPerm}
            MessageLikeHandler = {MessageLikeHandler}
            MessageDeleteHandler = {MessageDeleteHandler}
          />
        )
      });

      items.push(...messageArrays);

    });

    return items;
  }

  return (
    <ul ref = {selfRef} className="msg-list custom-scroll">
      {message && message.length >= PAGE_SIZE && 
        <li className="text-center mt-2 mb-2">
          <Button color="green" onClick = {onLoadMoreMessages}>Load More</Button>
        </li>
      }
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessage && RenderMessages()}
    </ul>
  );
};

export default MessageWindow;
