import React, { memo } from 'react'
import { useParams } from 'react-router';
import { Alert, Button, Drawer } from 'rsuite';
import { useCurrentRoom } from '../../../Context/CurrentRoomContext';
import { useMediaQuery, useOpen } from '../../../Misc/CustomHooks';
import { database } from '../../../Misc/firebase';
import EditableInput from '../../EditableInput';

const EditRoomInfo = () => {

  const { isOpen, open, close } = useOpen();
  const name = useCurrentRoom(val => val.name);
  const description = useCurrentRoom(val => val.description);
  const { chatID } = useParams();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const updateData = (key, value) => {
    database.ref(`/rooms/${chatID}`).child(key).set(value).then(() => {
        Alert.info('Successfully updated', 4000);
    }).catch(error => {
        Alert.error(error.message, 4000);
    });
  }

  const onNameSave = (newName) => {
    updateData('name', newName);
  }

  const onDescriptionSave = (newDescription) => {   
    updateData('description', newDescription)
  }

  return (
    <div>
      <Button className='br-circle mt-2 mr-2' size="sm" color='red' onClick = {open} >A</Button>
      <Drawer full = {isMobile} show = {isOpen} onHide = {close} placement = "right" >
        <Drawer.Header>
            <Drawer.Title>
                Edit Room Information
            </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
            <EditableInput 
                initialVal = {name}
                onSave = {onNameSave}
                label = {<h6 className='mb-2'>Name</h6>}
                emptyMessage = 'Name can not be empty'   
                wrapperClass = 'mt-2 mb-2'
            />
            <EditableInput 
                initialVal = {description}
                label = {<h6 className='mb-2'>Description</h6>}
                onSave = {onDescriptionSave}
                componentClass = "textarea"
                emptyMessage = 'Description can not be empty'
                rows = {5}
                wrapperClass = 'mt-3'
            />
        </Drawer.Body>
        <Drawer.Footer>
            <Button block color='red' onClick = {close} >
                Close
            </Button>
        </Drawer.Footer>
      </Drawer>
    </div>
  )
}

export default memo(EditRoomInfo);
