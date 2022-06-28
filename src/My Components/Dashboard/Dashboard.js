import React, { useCallback } from "react";
import { Alert, Button, Divider, Drawer } from "rsuite";
import { isOfflineForDatabase, useProfile } from "../../Context/profileContext";
import { useOpen } from "../../Misc/CustomHooks";
import { auth, database } from "../../Misc/firebase";
import { getUserUpdates } from "../../Misc/Helpers";
import EditableInput from "../EditableInput";
import AuthProviderInfo from "./AuthProviderInfo";
import AvtarUpload from "./AvtarUpload";

const Dashboard = () => {

  const { profile } = useProfile();
  const { close } = useOpen();

  const onSignOut = useCallback(() => {

    database.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase).then(() => {
      auth.signOut();
      Alert.info('Signed Out', 4000);
      close();
    }).catch(error => {
      Alert.error(error.message, 4000);
    })
    
  }, [close]);
       
  const onSaveInput = async (newName) => {           // to save the user's new nickname in the database
    try {

      const updates = await getUserUpdates(profile.uid, 'name', newName, database);
      await database.ref().update(updates);

      Alert.success('Nickname has been changed', 4000);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  }
    
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>
          Dashboard
        </Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h3>Hey {profile.name}</h3>
        <AuthProviderInfo />
        <Divider />
        <EditableInput 
          name = "nickname"
          initialVal = {profile.name}
          onSave = { onSaveInput }
          label = { <h6 className="mb-2">Nickname</h6> }
        />
        <AvtarUpload />
      </Drawer.Body>
     
      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>Sign Out</Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;
