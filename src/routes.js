import React from 'react';
import { Route } from 'react-router-dom';

import HomeContainer from './containers/HomeContainer';
import NuevoExpedienteContainer from './containers/NuevoExpedienteContainer';
import MainContainer from './containers/index';

export default (
  <div>
      <Route component={MainContainer}/>
      <Route exact path='/' component={HomeContainer}/>
      <Route path='/nuevo-expediente' component={NuevoExpedienteContainer}/>
  </div>
);