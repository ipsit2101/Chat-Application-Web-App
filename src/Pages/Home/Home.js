import React from 'react'
import { useRouteMatch } from 'react-router';
import { Route, Switch } from 'react-router';
import { Col, Grid, Row } from 'rsuite';
import { RoomsProvider } from '../../Context/RoomsContext';
import { useMediaQuery } from '../../Misc/CustomHooks';
import SideBar from '../../My Components/SideBar';
import Chat from './Chat';

const Home = () => {

  const isDesktop = useMediaQuery('(min-width: 992px)');
  const { isExact } = useRouteMatch();

  const RenderSideBar = isDesktop || isExact;

  return (
    <RoomsProvider>
      <Grid fluid className='h-100'>
        <Row className='h-100'>
          { RenderSideBar && 
            <Col xs={24} md={8} className = "h-100">
              <SideBar />
            </Col>
          }
          
          <Switch>
            <Route exact path = "/chats/:chatID" >
              <Col xs = {24} md = {16} className = "h-100">
                <Chat />
              </Col>  
            </Route>
            <Route>
              { isDesktop &&  
                <Col xs = {24} md = {16} className = "h-100">
                  <h6 className='text-center mt-page'>Please select chat</h6>
                </Col>
              }
            </Route>
          </Switch>
        </Row>
      </Grid>
    </RoomsProvider>
  )
}

export default Home;
