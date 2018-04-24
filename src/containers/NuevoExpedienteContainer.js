import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NuevoExpediente from '../components/NewExpedient/NewExpedient';
import NuevoExpediente2 from '../components/NewExpedient/NewExpedient2';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';




class NuevoExpedienteContainer extends Component {

    render() {
        return (
            <div className="nuevoExpedienteContainer">               
             
               <NuevoExpediente2/>                                
            </div>
        );
    }
}

export default withRouter(NuevoExpedienteContainer);