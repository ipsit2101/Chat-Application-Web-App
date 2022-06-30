import React, { useState } from 'react'
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Loader, Modal, Uploader } from 'rsuite';
import { useOpen } from '../../../Misc/CustomHooks';
import { storage } from '../../../Misc/firebase';

const MAX_FILE_SIZE = 5 * 1024* 1000;
   
const Attachments = ( {afterUpload} ) => {

  const { isOpen, open, close } = useOpen();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { chatID } = useParams();

  const onChange = (files) => {       
    const filteredFiles = files.filter(el => el.blobFile.size <= MAX_FILE_SIZE).slice(0, 5);   
    setFileList(filteredFiles);
  }   

  const onUpload = async () => {
    
    setIsLoading(true)
    try {

        const uploadPromises = fileList.map(file => {
            return storage.ref(`/chat/${chatID}`).child(Date.now() + file.name).put(file.blobFile, {
                cacheControl: `public max-age = ${3600*24*3}`
            });
        });

        const uploadSnapshots = await Promise.all(uploadPromises);   // returns an array of uploaded files

        const shapePromises = uploadSnapshots.map(async snapshots => {
            return {
                contentType: snapshots.metadata.contentType,  
                name: snapshots.metadata.name,
                url: await snapshots.ref.getDownloadURL()
            }
        });
        
        const allFiles = await Promise.all(shapePromises);
        await afterUpload(allFiles);

        setIsLoading(false);  
        close();
        
    } catch (error) {
        setIsLoading(false)
        Alert.error(error.message, 4000);
    }
  }

  return (  
    <>
      { isLoading && <Loader vertical content = "Uploading" speed = "slow" size = "md" /> }
      <InputGroup.Button onClick = {open}>
        <Icon icon = "attachment" />  
      </InputGroup.Button>
      <Modal show = {isOpen} onHide = {close}>
        <Modal.Header>
            <Modal.Title>
                Upload Files
            </Modal.Title>
        </Modal.Header>  
        <Modal.Body>
            <Uploader 
                autoUpload = {false}
                fileList = {fileList}
                action = ""
                onChange = {onChange}   
                listType = "picture-text"
                disabled = {isLoading}
            />
        </Modal.Body>
        <Modal.Footer>
            <Button block appearance="primary" color='green' onClick = {onUpload} disabled = {isLoading}>
                Send to chat   
            </Button>
            <div className='text-right mt-2'>
                <small>*Only files of less than 5 MB are allowed</small>
            </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Attachments;
