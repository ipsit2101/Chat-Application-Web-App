import React from 'react'
import { Button, Modal } from 'rsuite';
import { useOpen } from '../../../Misc/CustomHooks';
import ProfileAvatar from '../../Dashboard/ProfileAvatar';

const UserProfileInfo = ( {author} ) => {

  const { isOpen, open, close } = useOpen();
  const shortName = author.name.split(' ')[0];

  const memberSince = new Date(author.createdAt).toLocaleDateString();

  return (    
    <div>   
      <Button onClick = {open} appearance = "link" className='p-0 ml-1 text-black font-bolder'>      
        {shortName}
      </Button>
      <Modal show = {isOpen} onHide = {close}>
        <Modal.Header>
            <Modal.Title>
                {shortName} profile
            </Modal.Title>
        </Modal.Header> 
        <Modal.Body className='text-center'>
            <ProfileAvatar src = {author.avatar} name = {author.name} className = "width-200 height-200 img-fullsize" />
            <h4 className='mt-2'>{author.name}</h4>
            <p>Member since {memberSince}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button block color='green' appearance = 'primary' onClick = {close}>
                Close
            </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UserProfileInfo;
