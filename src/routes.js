import React from 'react';
import { Route } from 'react-router-dom';

import HomeContainer from './containers/HomeContainer';
import NuevoExpedienteContainer from './containers/NuevoExpedienteContainer';
import SelectorTipoTrabajoContainer from './containers/SelectorTipoTrabajoContainer';
import MainContainer from './containers/index';
import Login from './components/login/Login';
import { PrivateRoute } from './components/login/privateRoute';

export default (
  <div>
      <PrivateRoute exact path="/" component={MainContainer} />
      {/* <Route component={Login}/> */}
      {/* <Route exact path='/' component={MainContainer}/>
      <Route exact path='/home' component={HomeContainer}/> */}
      <PrivateRoute path='/nuevo-expediente' component={NuevoExpedienteContainer}/>
      <Route path='/selector-expediente' component={SelectorTipoTrabajoContainer}/>
      <Route path='/login' component={Login}/>

  </div>
);