import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import FichaExpediente from './fichaExpediente';
import ListaTrabajos from './listaTrabajos';

class TrabajoComunicacion extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container spacing={0}>
        <Grid item md={6} xs={12} >
          <FichaExpediente />
        </Grid>
        <Grid item md={6} xs={12} >
          <ListaTrabajos />
        </Grid>
      </Grid>
    );
  }
}

export default TrabajoComunicacion;