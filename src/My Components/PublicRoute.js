import React from 'react'
import { Route } from 'react-router';
import { Redirect } from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../Context/profileContext';

const PublicRoute = ({children, ...routeProps}) => {
  const { isLoading, profile } = useProfile();
                    
  if (isLoading && !profile) {        
    return <Container>
      <Loader center vertical size = "md" content = "Loading" speed = "slow" />
    </Container>
  }

  if (profile && !isLoading) { 
    return <Redirect to="/" />
  } 

  return (
    <Route {...routeProps}>{children}</Route>
  )
}

export default PublicRoute;
