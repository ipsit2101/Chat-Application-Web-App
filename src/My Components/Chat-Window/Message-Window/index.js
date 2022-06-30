import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Alert } from "rsuite";
import { auth, database, storage } from "../../../Misc/firebase";
import { TransformToArray } from "../../../Misc/Helpers";
import MessageItem from "./MessageItem";

const MessageWindow = () => {
  const { chatID } = useParams();
  const [message, setMessage] = useState(null);

  const isChatEmpty = message && message.length === 0;
  const canShowMessage = message && message.length > 0;
  let alertMsg = "";

  useEffect(() => {
    const messageRef = database.ref("/messages");
    messageRef
      .orderByChild("roomId")
      .equalTo(chatID)
      .on("value", (snapshot) => {
        const data = TransformToArray(snapshot.val());
        setMessage(data);
        console.log('Messages', message);
      });

    return () => {
      messageRef.off("value");
    };
  }, [chatID, message]);

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

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessage &&
        message.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdminPerm={handleAdminPerm}
            MessageLikeHandler = {MessageLikeHandler}
            MessageDeleteHandler = {MessageDeleteHandler}
          />
        ))}
    </ul>
  );
};

export default MessageWindow;
