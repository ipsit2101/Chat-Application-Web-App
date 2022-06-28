import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../Misc/firebase";
import firebase from "firebase/app";

export const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext(); // for creating a new context

export const ProfileProvider = ( {children} ) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // for setting the loading spinner

    useEffect(() => {    
        let userRef; 
        let userStatusDatabaseRef;   
        
        const authUnsubscribe = auth.onAuthStateChanged(authObject => {
            // authObject has the data of user who are currently signed in

            if (authObject) {
                userRef = database.ref(`/profiles/${authObject.uid}`);
                userStatusDatabaseRef = database.ref(`/status/${authObject.uid}`);

                userRef.on('value', (snapshot) => {
                    console.log(snapshot.val());

                    const { createdAt, name, avatar } = snapshot.val();

                    const profileData = {     // set the user data
                        createdAt,
                        name, 
                        avatar,
                        uid: authObject.uid,
                        email: authObject.email
                    }
                    setProfile(profileData);
                    setIsLoading(false);
                })

                database.ref('.info/connected').on('value', (snapshot) => {
                    // If we're not currently connected, don't do anything.
                    if (snapshot.val() === false) {
                        return;
                    };  
                
                    // If we are currently connected, then use the 'onDisconnect()' 
                    // method to add a set which will only trigger once this 
                    // client has disconnected by closing the app, 
                    // losing internet, or any other means.
                    userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(() => {
                        // The promise returned from .onDisconnect().set() will
                        // resolve as soon as the server acknowledges the onDisconnect() 
                        // request, NOT once we've actually disconnected:
                        // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect
                
                        // We can now safely set ourselves as 'online' knowing that the
                        // server will mark us as offline once we lose connection.
                        userStatusDatabaseRef.set(isOnlineForDatabase);
                    });
                });
            }
            else {
                if (userRef) {
                    userRef.off();
                }
                if (userStatusDatabaseRef) {
                    userStatusDatabaseRef.off();
                }
                database.ref('.info/connected').off();

                setProfile(null);
                setIsLoading(false);
            }
        })

        return () => {
            authUnsubscribe();
            if (userRef) {
                userRef.off();
            }
            if (userStatusDatabaseRef) {
                userStatusDatabaseRef.off();
            }
            database.ref('.info/connected').off();
        }

    }, []);

    return (
        <ProfileContext.Provider value = { {isLoading, profile} }>
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfile = () => useContext(ProfileContext);