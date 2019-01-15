import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import FichaExpediente from './fichaExpediente';
import ListaTrabajos from './listaTrabajos';
import TipoExpediente from './tipoExpediente';

class TrabajoComunicacion extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container spacing={0}>
        <Grid item md={6} xs={12} >
          <FichaExpediente expediente={this.props.expediente} sourceExpediente={this.props.expediente.Expediente.length > 0 ? this.props.expediente.Expediente[0] : {}}/>

          <TipoExpediente expediente={this.props.expediente} sourceExpediente={this.props.expediente.Expediente.length > 0 ? this.props.expediente.Expediente[0] : {}}/>
        </Grid>
        <Grid item md={6} xs={12} >
          <ListaTrabajos expediente={this.props.expediente}/>
        </Grid>
      </Grid>
    );
  }
}

export default TrabajoComunicacion;