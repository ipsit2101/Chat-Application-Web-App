import React, { useState } from "react";
import { Alert, Button, Icon, Tag } from "rsuite";
import { auth } from "../../Misc/firebase";
import firebase from "firebase/app";

const AuthProviderInfo = () => {

    const [authProvider, setAuthProvider] = useState({
        'google.com': auth.currentUser.providerData.some(item => item.providerId === 'google.com'),
        'facebook.com': auth.currentUser.providerData.some(item => item.providerId === 'facebook.com'),
    });

    const updateAuthProviderInfo = (providerId, value) => {

        setAuthProvider(prev => {  
            return {
                ...prev,
                [providerId]: value
            }
        });
    }

    const Unlink = async (providerId) => {  
        try {
            if (auth.currentUser.providerData.length === 1) {
                throw new Error(`You cannot disconnect from ${providerId}`);
            }

            await auth.currentUser.unlink(providerId);
            updateAuthProviderInfo(providerId, false);    

            Alert(`Disconnected from ${providerId}`, 4000);

        } catch (error) {
            Alert.error(error.message, 4000);
        }
    }

    const UnlinkFromGoogle = () => {  
        Unlink('google.com');
    }
    const UnlinkFromFacebook = () => {  
        Unlink('facebook.com');
    }

    const Link = async (provider) => {
        try {
            await auth.currentUser.linkWithPopup(provider);
            Alert.info(`Connected to ${provider.providerId}`); 

            updateAuthProviderInfo(provider.providerId, true);
        } catch (error) {
            Alert.error(error.message, 4000);
        }
    }

    const LinktoGoogle = () => {
        Link(new firebase.auth.GoogleAuthProvider());    
    }
    const LinktoFacebook = () => {
        Link(new firebase.auth.FacebookAuthProvider());
    }

  return (
    <div className="mt-3">

        { authProvider['google.com'] && 
            <Tag color="red" closable onClose = { UnlinkFromGoogle }>
                <Icon icon="google"/> Connected
            </Tag>
        }
        { authProvider['facebook.com'] && 
            <Tag color="blue" closable onClose = { UnlinkFromFacebook }>
                <Icon icon="facebook"/> Connected
            </Tag>
        }
        { !authProvider['google.com'] && 
             <div className="mt-3">
                <Button block color="red" onClick = {LinktoGoogle}>
                    <Icon icon = "google" /> Link to Google
                </Button>
            </div>
        }
        { !authProvider['facebook.com'] &&
            <div className="mt-3">   
                <Button block color="blue" onClick = { LinktoFacebook }>
                    <Icon icon = "facebook" /> Link to Facebook
                </Button>
            </div>
        }
       
    </div>
  )
};

export default AuthProviderInfo;
