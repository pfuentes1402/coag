import React, { Component } from 'react';
import { Container } from "reactstrap";
import Arquitecto from './Arquitectos';
import Promotores from './Promotores';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Close from '@material-ui/icons/Close';
import { connect } from "react-redux";
import { postAddTrabajoEncomenda } from '../../actions/expedientes/index';

const styles = theme => ({
  margin: {
    marginTop: 30
  },
  titleMainPanel: {
    borderBottom: '1.5px solid ' + grey[100],
  },
  marginPanel: {
    margin: '15px 0px'
  }
});



class Agentes extends Component {
  constructor(props) {
    super(props);
  }

  mapFuncionesTipologias(codes) {
    let functionsId = codes.map(funct => {
      let functId = this.props.funcionesTipologicas.find(x => x.Codigo === funct);
      return functId ? functId.id_Funcion : "";
    })
    return functionsId;
  }

  async addTrabajoEncomenda() {
    let comunicacionEncargo = this.props.comunicacionEncargo.find(x => x.isSelected)
      ? this.props.comunicacionEncargo.find(x => x.isSelected)
      : null;
    if (comunicacionEncargo === null) return;
    let trabajoEncomenda = {
      Id_Tipo_Grupo_Tematico: comunicacionEncargo.obraSelection,
      Id_Tipo_Autorizacion_Municipal: comunicacionEncargo.tramiteSelection,
      Id_Tipo_Fase: 1,
      Id_Tipo_Trabajo: 219,
      Id_Tipo_Tramite: 2,
      Colegiados: this.props.selectedColegiados.map((value) => {
        return {
          Id_Colegiado: value.Id_Colegiado,
          Id_Tipo_Colegiado: value.Agente.Id_Tipo_Colegiado,
          Id_Sociedad: value.Agente.Id_Tipo_Colegiado !== 1 ? 1 : 0,
          Porcentaje: value.Porciento,
          PorcentajesEquitativos: 0,
          Ids_Funciones: value.Funciones ? this.mapFuncionesTipologias(value.Funciones).join(",") : ""
        }
      }),
      Promotores: this.props.selectedPromoters.map(value => {
        return {
          id_entidad: value.Id_Entidad,
          Nif: value.Nif,
          Id_Tipo_Entidad: value.Id_Tipo_Entidad,
          Nombre: value.Nombre,
          Apellido1: value.Apellido1,
          Apellido2: value.Apellido2,
          Observaciones: value.Observaciones ? value.Observaciones : null,
          Mail: value.Mail ? value.Mail : "",
          Telefono: value.Telefono ? value.Telefono : null,
          Calle: value.Calle ? value.Calle : "",
          Numero: value.Numero ? value.Numero : "",
          Piso: value.Piso ? value.Piso : "",
          Codigo_Postal: value.Codigo_Postal ? value.Codigo_Postal : null,
          Id_Concello: value.Id_Concello ? value.Id_Concello : 0,
          Id_Provincia: value.Id_Provincia ? value.Id_Provincia : 0,
          Id_Autonomia: value.Id_Autonomia ? value.Id_Autonomia : 0,
          Id_Pais: value.Id_Pais ? value.Id_Pais : 0,
          PorcentajesEquitativos: value.PorcentajesEquitativos ? value.PorcentajesEquitativos : 0,
        }
      }),
      IgnorarObservaciones: 1
    };

    //Obtener el id de expediente del estado de redux y llamar la funcion
    //postAddTrabajoEncomenda
    let currentExpId = this.props.currentExpediente.Expediente
      && this.props.currentExpediente.Expediente.length > 0
      ? this.props.currentExpediente.Expediente[0].Id_Expediente : null;
    let success = await this.props.postAddTrabajoEncomenda(currentExpId, trabajoEncomenda);
    
    //Validación para continuar (si el resultado fue 200 se permite continuar)
    if(success)
      this.props.history.push("/visualizar-expediente");
  }

  render() {
    let { classes } = this.props;
    console.log("this.porps->",this.props);
    return (
      <Container className={classes.margin}>
        <Grid item xs={12} className="min-height-panel">
          <ExpansionPanel expanded={true}>
            <ExpansionPanelSummary style={{ minHeight: 48, height: 48 }}
              className={classes.titleMainPanel}>
              <div>Introducir agentes del expediente</div>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Grid container spacing={24}>
                <Grid item md={6} xs={12} className={classes.marginPanel}>
                  <Arquitecto classes={this.styles} />
                </Grid>
                <Grid item md={6} xs={12} className={classes.marginPanel}>
                  <Promotores customClass={styles} />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>

        <Grid item xs={12} className="py-5">
          <Button variant="contained" size="small" color="primary" className="float-right px-3"
            onClick={() => this.addTrabajoEncomenda()}>
            Finalizar
          </Button>
          <Button color="primary" size="small" className="float-right mx-2">
            Cancelar<Close className={classes.rightIcon} />
          </Button>
          <Button color="primary" size="small" className="float-left px-4" onClick={() => { this.props.history.push("/comunicacion") }}>
            Volver
          </Button>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedColegiados: state.trabajos.agentesTrabajoSelected ? state.trabajos.agentesTrabajoSelected : [],
  selectedPromoters: state.expedientes.promotores,
  loguedUser: state.user.DatosUsuarioValidado,
  comunicacionEncargo: state.trabajos.comunicacionEncargo,
  expedientes: state.expedientes,
  funcionesTipologicas: state.trabajos.funcionesTipologia.data ? state.trabajos.funcionesTipologia.data.Tipos_Trabajos_Funciones : [],
  currentExpediente: state.expedientes.ExpedientNew ? state.expedientes.ExpedientNew : {},
  state: state
})

const mapDispatchToProps = {
  postAddTrabajoEncomenda: postAddTrabajoEncomenda
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Agentes));