import React, { memo } from 'react'
import { useCurrentRoom } from '../../../Context/CurrentRoomContext';

const TopWindow = () => {

  const name = useCurrentRoom(val => val.name)

  return (
    <div>
        {name}
    </div>
  )
}

export default memo(TopWindow);
