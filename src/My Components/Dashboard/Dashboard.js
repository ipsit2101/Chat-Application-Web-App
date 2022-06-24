import React, { useCallback } from "react";
import { Alert, Button, Drawer } from "rsuite";
import { useProfile } from "../../Context/profileContext";
import { useOpen } from "../../Misc/CustomHooks";
import { auth } from "../../Misc/firebase";

const Dashboard = () => {

  const { profile } = useProfile();
  const { close } = useOpen();

  const onSignOut = useCallback(() => {
    auth.signOut();
    Alert.info('Signed Out', 4000);

    close();
  }, [close]);
    
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>
          Dashboard
        </Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h3>Hey {profile.name}</h3>
      </Drawer.Body>
     
      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>Sign Out</Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;
