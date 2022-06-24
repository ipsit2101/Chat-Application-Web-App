import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../Misc/firebase";

const ProfileContext = createContext();    // for creating a new context

export const ProfileProvider = ( {children} ) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // for setting the loading spinner

    useEffect(() => {    
        let userRef;    
        
        const authUnsubscribe = auth.onAuthStateChanged(authObject => {
            // authObject has the data of user who are currently signed in

            if (authObject) {
                userRef = database.ref(`/profiles/${authObject.uid}`);
                userRef.on('value', (snapshot) => {

                    const { createdAt, name } = snapshot.val();

                    const profileData = {     // set the user data
                        createdAt, 
                        name,   
                        uid: authObject.uid,
                        email: authObject.email
                    }
                    setProfile(profileData);
                    setIsLoading(false);
                })
            }
            else {
                if (userRef) {
                    userRef.off();
                }
                setProfile(null);
                setIsLoading(false);
            }
        })

        return () => {
            authUnsubscribe();
            if (userRef) {
                userRef.off();
            }
        }

    }, []);

    return (
        <ProfileContext.Provider value = { {isLoading, profile} }>
            {children}
        </ProfileContext.Provider>
    )
}

export const useProfile = () => useContext(ProfileContext);