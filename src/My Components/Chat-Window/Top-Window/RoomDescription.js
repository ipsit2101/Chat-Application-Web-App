import React from 'react'
import { Button, Modal } from 'rsuite';
import { useCurrentRoom } from '../../../Context/CurrentRoomContext';
import { useOpen } from '../../../Misc/CustomHooks';

const RoomDescription = () => {

  const description = useCurrentRoom(val => val.description);
  const name = useCurrentRoom(val => val.name);
  const { isOpen, open, close } = useOpen();

  return (
    <div>
      <Button appearance = "default" className='px-1' onClick = {open}>
        Room Information
      </Button>
      <Modal show = {isOpen} onHide = {close}>
        <Modal.Header>
            <Modal.Title>
                {name}
            </Modal.Title>
        </Modal.Header> 
        <Modal.Body>
            <h6 className='mb-1'>Description</h6>
            <p>{description}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button block appearance = 'primary' onClick = {close}>
                Close
            </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default RoomDescription;
