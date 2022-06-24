import React from 'react'
import { Button, Drawer, Icon } from 'rsuite';
import { useMediaQuery, useOpen } from '../../Misc/CustomHooks';
import Dashboard from './Dashboard';

const DashboardToggle = () => {
  const { isOpen, open, close } = useOpen();
  const isMobile = useMediaQuery('(max-width: 992px)');

  return (
    <>
      <Button block color='green' onClick = {open}>
        <Icon icon="dashboard" /> Dashboard
      </Button>
      <Drawer full = {isMobile} show = {isOpen} onHide = {close} placement = 'left'>
        <Dashboard />
      </Drawer>
    </>
  )
}

export default DashboardToggle;
