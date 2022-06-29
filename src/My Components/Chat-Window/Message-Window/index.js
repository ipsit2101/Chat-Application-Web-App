import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Alert } from "rsuite";
import { auth, database } from "../../../Misc/firebase";
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
      });

    return () => {
      messageRef.off("value");
    };
  }, [chatID]);

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
          />
        ))}
    </ul>
  );
};

export default MessageWindow;
