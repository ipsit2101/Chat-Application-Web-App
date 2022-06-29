import React, { useRef, useState } from 'react'
import { Alert, Button, Loader, Modal } from 'rsuite';
import { useOpen } from '../../Misc/CustomHooks';
import AvatarEditor from "react-avatar-editor";
import { storage, database } from '../../Misc/firebase';
import { useProfile } from '../../Context/profileContext';
import ProfileAvatar from './ProfileAvatar';
import { getUserUpdates } from '../../Misc/Helpers';

const AvtarUpload = () => {

  const acceptedFileType = ".png, .jpg, .jpeg";    
  const assciatedMimeTypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
  const { profile } = useProfile();
  
  const  [avatarImage, setAvatarImage] = useState(null);
  const [isLoad, setIsLoad] = useState(false);       // Loading Spinner
  const avatarRef = useRef();

  const isFileValid = (file) => {
    return assciatedMimeTypes.includes(file.type);
  }

  const { isOpen, open, close } = useOpen();

  const onFileTypeChange = (event) => {
    const currFiles = event.target.files;

    if (currFiles.length === 1) {
        const file = currFiles[0];
        if (isFileValid(file)) {
            setAvatarImage(file);
            open(); // open the preview window
        }  
        else Alert.warning(`Invalid File Type. Can't upload ${file.type}`, 4000);
    }
  }

  const getBlob = (canvas) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        }
        else {
          reject(new Error('File processing error'));
        }
      });
    });
  }

  const uploadAvatar = async () => {       // upload the avatar image in the firebase storage
    const canvas = avatarRef.current.getImageScaledToCanvas();
    
    setIsLoad(true);
    try {
      const blob = await getBlob(canvas);
      const avatarFileRef = storage.ref(`/profile/${profile.uid}`).child('avatar');

      const uploadResult = avatarFileRef.put(blob, {
        cacheControl: `public, max-age = ${3600 * 24 * 3}`
      });

      const downloadURL = await (await uploadResult).ref.getDownloadURL();
    
      // const userAvatarRes = database.ref(`/profiles/${profile.uid}`).child('avatar');
      // await userAvatarRes.set(downloadURL);
      const updates = await getUserUpdates(profile.uid, 'avatar', downloadURL, database);
      await database.ref().update(updates);
      
      setIsLoad(false);
      Alert.success(`Avatar has been changed`, 4000);

    } catch (error) {
      setIsLoad(false);
      Alert.error(error.message, 4000);
    }
  }

  return (
    <div className='mt-3 text-center'>
      <ProfileAvatar src = {profile.avatar} name = {profile.name} className = "width-200 height-200 img-fullsize font-huge" />
      <label htmlFor='avatar' className='d-block cursor-pointer padded'>
        Select new avatar
        <input id = "avatar" type = 'file' className='d-none' accept = {acceptedFileType} onChange = {onFileTypeChange} />
      </label>

      <Modal show = {isOpen} onHide = {close}>
        <Modal.Header>
            Adjust and upload new Avatar
        </Modal.Header>
        <Modal.Body>
            {avatarImage && 
              <div className='d-flex justify-content-center rs-icon-align-center font-huge'>
                <AvatarEditor
                  ref = {avatarRef}
                  image={avatarImage}
                  borderRadius={10}
                  width={200}
                  height={200}
                  border={50}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={1.2}
                  rotate={0}
                />
              </div>    
            }
        </Modal.Body>
        <Modal.Footer>
            { isLoad && <Loader center vertical content = "Loading" speed = "slow" size = "md" /> }
            <Button block appearance='ghost' onClick = {uploadAvatar} disabled = {isLoad}>
                Upload New Avatar
            </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AvtarUpload;
