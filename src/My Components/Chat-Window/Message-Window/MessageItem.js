import React, { memo } from "react";
import { Button } from "rsuite";
import TimeAgo from "timeago-react";
import { useCurrentRoom } from "../../../Context/CurrentRoomContext";
import { useHover } from "../../../Misc/CustomHooks";
import { auth } from "../../../Misc/firebase";
import ProfileAvatar from "../../Dashboard/ProfileAvatar";
import PresenceDot from "../../PresenceDot";
import MessageIconControl from "./MessageIconControl";
import UserProfileInfo from "./UserProfileInfo";

const MessageItem = ( {message, handleAdminPerm} ) => {

  const { author, createdAt, text } = message;
  const isAdmin = useCurrentRoom(val => val.isAdmin);
  const admins = useCurrentRoom(val => val.admins);

  const isAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const [hover, isHovered] = useHover();
   
  return (
    <li className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`}  ref = {hover}>    
        <div className="d-flex align-items-center font-bolder mb-1">
            <PresenceDot uid = {author.uid} />
            <ProfileAvatar src = {author.avatar} name = {author.name} className = "ml-1" size = "xs" />
            <UserProfileInfo author = {author}>
  
              { canGrantAdmin && <Button block color="red" onClick = {() => handleAdminPerm(author.uid)}>
                { isAuthorAdmin ? 'Remove Admin Permission' : 'Grant Admin Permission' }
              </Button>}

            </UserProfileInfo>
            <TimeAgo datetime = {createdAt} className = "font-normal text-black-45 ml-2" />
            <MessageIconControl 
              isVisible
              iconName = "heart"
              color = "red"
              tooltip = "Like this message"
              onClick = {() => {}}
              badgeContent = {5}
            />
        </div>
        <div>
            <span className="word-breal-all">{text}</span>
        </div>
    </li>
  )
}

export default memo(MessageItem);
