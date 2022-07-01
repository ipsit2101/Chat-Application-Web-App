import React, { memo } from "react";
import { Button } from "rsuite";
import TimeAgo from "timeago-react";
import { useCurrentRoom } from "../../../Context/CurrentRoomContext";
import { useHover, useMediaQuery } from "../../../Misc/CustomHooks";
import { auth } from "../../../Misc/firebase";
import ProfileAvatar from "../../Dashboard/ProfileAvatar";
import PresenceDot from "../../PresenceDot";
import MessageIconControl from "./MessageIconControl";
import RenderImage from "./RenderImage";
import UserProfileInfo from "./UserProfileInfo";

const MessageItem = ( {message, handleAdminPerm, MessageLikeHandler, MessageDeleteHandler} ) => {

  const { author, createdAt, text, likes, file, likeCount } = message;
  const isAdmin = useCurrentRoom(val => val.isAdmin);
  const admins = useCurrentRoom(val => val.admins);
     
  const isAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAdmin = isAdmin && !isAuthor;

  const [hover, isHovered] = useHover();
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);   // boolean to check if current signed-in user has liked the message
  const isMobile = useMediaQuery('(max-width: 992px)');
  const canShowMessageIcon = isMobile || isHovered;

  const RenderFile = (file) => {
    
    if (file.contentType.includes('image')) {
      return (
        <div className="height-220">
          <RenderImage src = {file.url} name = {file.name} />
        </div>
      )   
    }
    
    if (file.contentType.includes('audio')) {
      return (
        <audio controls>
          <source src = {file.url} type = "audio/mp3" />
        </audio>
      )
    }

    return (
      <a href = {file.url}>Download {file.name}</a>
    )
  }
   
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
              color = {isLiked ? "red" : ""}
              isVisible = {canShowMessageIcon}
              iconName = "heart"   
              tooltip = "Like this message"
              onClick = {() => MessageLikeHandler(message.id)}
              badgeContent = {likeCount}
            />
            { isAuthor &&        // Only auhor can delete this message
              <MessageIconControl 
                //color = {isLiked ? "red" : ""}
                isVisible = {canShowMessageIcon}
                iconName = "close"       
                tooltip = "Delete this message"
                onClick = {() => MessageDeleteHandler(message.id, file)}
              />  
            }
        </div>
        <div>
            {text && <span className="word-break-all">{text}</span>}
            {file && RenderFile(file)}
        </div>
    </li>
    
  )
}

export default memo(MessageItem);
