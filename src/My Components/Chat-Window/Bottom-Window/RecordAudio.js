import React, { useCallback, useState } from "react";
import { ReactMic } from "react-mic";
import { useParams } from "react-router";
import { Alert, Icon, InputGroup, Loader } from "rsuite";
import { storage } from "../../../Misc/firebase";

const RecordAudio = ({ afterUpload }) => {      

  const [isRecording, setIsRecording] = useState(false);
  const { chatID } = useParams();
  const [isUploading, setIsUploading] = useState(false);
         
  const onUploadVoice = useCallback(async (data) => {

    setIsUploading(true)
    try {    
        const snapshots = await storage.ref(`/chat/${chatID}`).child(`audio_${Date.now()}.mp3`).put(data.blob, {
            cacheControl: `public, max-age = ${3600*24*3}`,
        });

        const file = {
            contentType: snapshots.metadata.contentType,  
            name: snapshots.metadata.name,
            url: await snapshots.ref.getDownloadURL()
        }

        afterUpload([file]);
        setIsUploading(false);

    } catch (error) {
        setIsUploading(false);
        Alert.error(error.message, 4000);
    }
  }, [afterUpload, chatID]);     

  const onClick = useCallback(() => {
    setIsRecording(val => !val)
  }, []);

  return (
    <>
      { isUploading && <Loader center vertical content = "Loading" speed = "slow" size = "sm" /> }
      <InputGroup.Button onClick = {onClick} disabled = {isUploading} className = {isRecording ? 'animate-blink' : ''}>
        <Icon icon="microphone" />
        <ReactMic
          className="d-none"
          record={isRecording}
          onStop={onUploadVoice}
          mimeType = "audio/mp3"
        />
      </InputGroup.Button>
    </>
  );
};

export default RecordAudio;
