import React from 'react'
import { Avatar } from 'rsuite';
import { getNameInitials } from '../../Misc/Helpers';

const ProfileAvatar = ({name}) => {
  return (
    <Avatar>
        { getNameInitials(name) }
    </Avatar>
  )
}

export default ProfileAvatar;
