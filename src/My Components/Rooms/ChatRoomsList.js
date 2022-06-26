import React from "react";
import { Nav } from "rsuite";
import RoomItems from "./RoomItems";

const ChatRoomsList = ({ aboveEleHeight }) => {
  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style = { {
        height: `calc(100% - ${aboveEleHeight}px)`
      } }
    >
      <Nav.Item>
        <RoomItems />
      </Nav.Item>
    </Nav>
  );
};

export default ChatRoomsList;
