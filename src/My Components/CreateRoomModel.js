import React, { useCallback, useRef, useState } from 'react'
import { Alert, Button, ControlLabel, Form, FormControl, FormGroup, Icon, Modal, Schema } from 'rsuite';
import { useOpen } from '../Misc/CustomHooks';
import firebase from 'firebase/app';
import { database } from '../Misc/firebase';

const { StringType } = Schema.Types;

const model = Schema.Model({
    name: StringType().isRequired('Room Name cannot be empty'),
    description: StringType().isRequired('Description is required'),
});

const INITAL_FORM_VALUE = {
    name: '',
    description: ''
}

const CreateRoomModel = () => {

    const { isOpen, open, close } = useOpen();
    const [formData, setFormData] = useState(INITAL_FORM_VALUE);
    const [isLoading, setIsLoading] = useState(false);      // Loading Spinner

    const onFormChange = useCallback( value => {
        setFormData(value);
    }, []);

    const formRef = useRef();

    const onSubmitForm = async () => {
        if (!formRef.current.check()) {
            return;
        }

        setIsLoading(true);
        const newRoomDetails = {  
            ...formData,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
        }

        try {
            //Generates a new child location using a unique key and returns its Reference.
            //This is the most common pattern for adding data to a collection of items.
            //If you provide a value to push(), the value is written to the generated location. If you don't pass a value, nothing is written to the database and the child remains empty (but you can use the Reference elsewhere).
            await database.ref('rooms').push(newRoomDetails);  
            setIsLoading(false);
            setFormData(INITAL_FORM_VALUE);
            close();
            Alert.success('New Room has been created', 4000);     

        } catch (error) {
            setIsLoading(false);
            Alert.error(error.message, 4000);
        }
  }

  return (
    <div className='mt-3'>
      <Button block color="green" onClick={open}>    
        <Icon icon = "creative" /> Create new chat room
      </Button>

      <Modal show = {isOpen} onHide = {close}>
        <Modal.Header>
            <Modal.Title>
                New Chat Room
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form fluid onChange = {onFormChange} formValue = {formData} model = {model}  ref = {formRef} >
                <FormGroup>
                    <ControlLabel>Room Name</ControlLabel>
                    <FormControl name='name' placeholder = "Enter new chat room name..." />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Description</ControlLabel>
                    <FormControl componentClass="textarea" rows={5} name='description' placeholder = "Enter room description..." />
                </FormGroup>
            </Form> 
        </Modal.Body>
        <Modal.Footer>
            <Button block appearance='primary' onClick={onSubmitForm} disabled = {isLoading}>
                Create New Room
            </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CreateRoomModel;
