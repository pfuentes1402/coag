import React from 'react';
import { Route } from 'react-router-dom';

import HomeContainer from './containers/HomeContainer';
import NuevoExpedienteContainer from './containers/NuevoExpedienteContainer';
import SelectorTipoTrabajoContainer from './containers/SelectorTipoTrabajoContainer';
import MainContainer from './containers/index';
import Login from './components/login/Login';

export default (
  <div>
      <Route component={MainContainer}/>
      <Route exact path='/' component={HomeContainer}/>
      <Route exact path='/home' component={HomeContainer}/>
      <Route path='/nuevo-expediente' component={NuevoExpedienteContainer}/>
      <Route path='/selector-expediente' component={SelectorTipoTrabajoContainer}/>
      <Route path='/login' component={Login}/>

  </div>
);