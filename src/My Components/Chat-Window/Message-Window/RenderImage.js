import React from 'react'
import { Modal } from 'rsuite';
import { useOpen } from '../../../Misc/CustomHooks';

const RenderImage = ( {src, name} ) => {
  const { isOpen, open, close } = useOpen();   

  return (  
    <>
      <input type = "image" src = {src} alt = {name} onClick = {open} className = "mw-100 mh-100 w-auto" />
      <Modal show = {isOpen} onHide = {close}>
        <Modal.Header>
            <Modal.Title>
                {name}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                <img src = {src} alt = {name} height="100%" width="100%" />
            </div>
        </Modal.Body>
        <Modal.Footer>
            <a href={src} target = "_blank" rel = "noopener noreferrer">
                View Original
            </a>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default RenderImage;
