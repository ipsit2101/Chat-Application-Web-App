import React from 'react'
import { Badge, Tooltip, Whisper } from 'rsuite';
import { useUserPresence } from '../Misc/CustomHooks';

const PresenceDot = ( {uid} ) => { 

  const presence = useUserPresence(uid);
       
  const getText = (presence) => {  
    if (!presence) return 'Unknown state';

    return presence.state === 'online' ? 'Online' : `Last seen on ${new Date(presence.last_changed).toLocaleDateString()}`;
  }

  const getColor = (presence) => {
    if (!presence) return 'gray';

    switch(presence.state) {
        case 'online': return 'green';
        case 'offline': return 'red';
        default: return 'gray';
    }
  }

  return (
    <Whisper placement='top' trigger="hover" speaker = {<Tooltip>
        { getText(presence) }
    </Tooltip>}>
        <Badge className='cursor-pointer' style = { { backgroundColor: getColor(presence) } } />
    </Whisper>
  )
}

export default PresenceDot;
