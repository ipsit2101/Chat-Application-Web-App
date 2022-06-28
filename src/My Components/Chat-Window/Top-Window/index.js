import React, { memo } from "react";
import { Link } from "react-router-dom";
import { ButtonToolbar, Icon } from "rsuite";
import { useCurrentRoom } from "../../../Context/CurrentRoomContext";
import { useMediaQuery } from "../../../Misc/CustomHooks";
import EditRoomInfo from "./EditRoomInfo";
import RoomDescription from "./RoomDescription";

const TopWindow = () => {
  const name = useCurrentRoom(val => val.name);
  const isAdmin = useCurrentRoom(val => val.isAdmin);
  const isMobile = useMediaQuery("(max-width: 992px)");

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h4 className = "text-disappear d-flex align-items-center">
          <Icon
            componentClass={Link}
            to="/"
            icon="arrow-circle-left"
            size="2x"
            className={
              isMobile        
                ? "d-iniline-block p-2 mr-1 mt-1 text-blue link-unstyled"
                : "d-none"
            }
          />
          <span className="text-disappear mt-2">{name}</span>
        </h4>
        <ButtonToolbar className="ws-nowrap">
          { isAdmin && <EditRoomInfo /> /* EditRoomOption is made available only to those users who are Admins */}
        </ButtonToolbar>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span>todo</span>
        <RoomDescription />
      </div>
    </>
  );
};

export default memo(TopWindow);
