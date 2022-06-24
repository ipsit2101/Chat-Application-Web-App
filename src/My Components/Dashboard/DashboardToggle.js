import React from 'react'
import { Button, Drawer, Icon } from 'rsuite';
import { useOpen } from '../../Misc/CustomHooks';
import Dashboard from './Dashboard';

const DashboardToggle = () => {
  const { isOpen, open, close } = useOpen();

  return (
    <>
      <Button block color='green' onClick = {open}>
        <Icon icon="dashboard" /> Dashboard
      </Button>
      <Drawer show = {isOpen} onHide = {close} placement = 'left'>
        <Dashboard />
      </Drawer>
    </>
  )
}

export default DashboardToggle;
