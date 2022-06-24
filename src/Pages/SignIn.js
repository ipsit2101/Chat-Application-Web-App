import React from "react";
import { Container, Grid, Row, Col, Panel, Button, Icon, Alert } from "rsuite";
import firebase from "firebase/app";
import { auth, database } from "../Misc/firebase";

const SignIn = () => {

  const onSignInProvider = async (provider) => {
    try {
      const { additionalUserInfo, user } = await auth.signInWithPopup(provider);
      console.log(additionalUserInfo);

      if (additionalUserInfo.isNewUser) {
        await database.ref(`/profiles/${user.uid}`).set({       //set method writes the user infornmation to the database location
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        })
      }
      
      Alert.success("Signed In", 4000);   
    }
    catch(error) {
      Alert.info(error.message, 4000);
    }
  }

  const FacebookSignIn = () => {
    onSignInProvider(new firebase.auth.FacebookAuthProvider());
  }

  const GoogleSignIn = () => {
    onSignInProvider(new firebase.auth.GoogleAuthProvider());
  }

  return (
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcome to chat</h2>
                <p>Progressive Web App</p>
              </div>
              <div className="mt-3">
                <Button block color="blue" onClick={FacebookSignIn}>
                  <Icon icon="facebook" />  Sign In with Facebook
                </Button>
                <Button block color="red" onClick={GoogleSignIn}>
                  <Icon icon="google" />  Sign In with Google
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default SignIn;
