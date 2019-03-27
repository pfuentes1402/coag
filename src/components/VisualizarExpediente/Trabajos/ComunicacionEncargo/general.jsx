import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import FichaExpediente from './fichaExpediente';
import ListaTrabajos from './listaTrabajos';
import TipoExpediente from './tipoExpediente';

class ExpedienteGeneral extends Component {
    render() {
        return (
            <Grid container spacing={0}>
                <Grid item md={6} xs={12} >
                    <FichaExpediente disable={false} expediente={this.props.expediente}
                        sourceExpediente={this.props.expediente.Expediente.length > 0 ? this.props.expediente.Expediente[0] : {}}
                        updateExpediente={(expediente) => this.props.updateExpediente(expediente)} />

                    <TipoExpediente expediente={this.props.expediente} sourceExpediente={this.props.expediente.Expediente.length > 0 ? this.props.expediente.Expediente[0] : {}} />
                </Grid>
                <Grid item md={6} xs={12} >
                    <ListaTrabajos
                        changeEstructura={(idTrabajo) => this.props.changeEstructura(idTrabajo)}
                        expediente={this.props.expediente} />
                </Grid>
            </Grid>
        );
    }
}

export default ExpedienteGeneral;