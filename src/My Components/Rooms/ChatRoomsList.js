import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Loader, Nav } from "rsuite";
import { useRooms } from "../../Context/RoomsContext";
import RoomItems from "./RoomItems";

const ChatRoomsList = ({ aboveEleHeight }) => {
  const rooms = useRooms();
  const location = useLocation();

  return (
    <Nav
      appearance="subtle"
      vertical
      reversed  
      className="overflow-y-scroll custom-scroll"
      style = { {
        height: `calc(100% - ${aboveEleHeight}px)`,
      } }
      activeKey = {location.pathname}
    >
        {!rooms && <Loader center vertical content = "Loading" speed = "slow" size = "md" />}
        { rooms && rooms.length > 0 &&
            rooms.map(room => {
                return (
                    <Nav.Item componentClass = {Link} to = {`/chats/${room.id}`} key = {room.id} eventKey = {`/chats/${room.id}`}>
                        <RoomItems roomInfo = {room} />
                    </Nav.Item>
                )
            })
        }
    </Nav>
  );
};

export default ChatRoomsList;
