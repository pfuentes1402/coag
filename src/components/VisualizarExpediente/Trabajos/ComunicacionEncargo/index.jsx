import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import FichaExpediente from './fichaExpediente';
import TipoExpediente from './tipoExpediente';
import TemporalFolder from '../ProyectoEjecucion/TemporalFolder'
class TrabajoComunicacion extends Component {

  render() {

    return (
      <Grid container spacing={0}>
        <Grid item md={6} xs={12} >
          <FichaExpediente disable={true} expediente={this.props.expediente} sourceExpediente={this.props.expediente.Expediente.length > 0 ? this.props.expediente.Expediente[0] : {}}/>
        </Grid>
        <Grid item md={6} xs={12} >
            <TipoExpediente expediente={this.props.expediente} sourceExpediente={this.props.expediente.Expediente.length > 0 ? this.props.expediente.Expediente[0] : {}}/>
        </Grid>
      </Grid>
    );
  }
}

export default TrabajoComunicacion;