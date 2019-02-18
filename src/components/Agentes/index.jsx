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
import { manageEncomenda } from '../../api';
import { fetchErrorExpediente, formatMenssage } from '../../actions/expedientes/index';
import { withRouter } from 'react-router-dom';
import { Translate } from "react-localize-redux";
import {Dialog, DialogContent, CircularProgress} from "@material-ui/core";

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
    this.state = {
      encomenda: this.props.encomenda,
        isLoading: false
    }
  }

  mapFuncionesTipologias(codes) {
    let functionsId = codes.map(funct => {
      let functId = this.props.funcionesTipologicas.find(x => x.Codigo === funct);
      return functId ? functId.id_Funcion : "";
    })
    return functionsId;
  }

  //Funcion que consume la api para crear un nuevo trabajo encomenda
  async addTrabajoEncomenda() {
    await this.setState({isLoading: true});
    try {
        let encomenda = this.state.encomenda;
        let encomendaActual = encomenda.EncomendaActual && encomenda.EncomendaActual.length > 0
            ? encomenda.EncomendaActual[0] : null;

        if (encomendaActual) {
            let trabajoEncomenda = {
                Id_Tipo_Grupo_Tematico: encomendaActual.Id_Tipo_Grupo_Tematico,
                Id_Tipo_Autorizacion_Municipal: encomendaActual.Id_Tipo_Autorizacion_Municipal,
                Id_Tipo_Fase: 1,
                Id_Tipo_Trabajo: 219,/*219 significa que es una encomenda*/
                Id_Tipo_Tramite: 0, /*0 Visado normal*/
                Colegiados: encomenda.Colegiados,
                Promotores: encomenda.Promotores,
                IgnorarObservaciones: 1
            };

            //Obtener el id de expediente del estado de redux y llamar la funcion
            //postAddTrabajoEncomenda
            let currentExpId = encomendaActual.Id_Expediente;
            let result = await manageEncomenda(currentExpId, trabajoEncomenda);

            //Validación para continuar (si el resultado fue 200 se permite continuar)
            if (result.data && result.data.MensajesProcesado && result.data.MensajesProcesado.length === 0) {
                let url = `/visualizar-expediente/${currentExpId}`;
                await this.setState({isLoading: false});
                this.props.history.push(url);
                return true;
            }
            else{
                if(result.MensajesProcesado && result.MensajesProcesado.length > 0){
                    await this.setState({isLoading: false});
                    this.props.fetchErrorExpediente(result);
                    return false;
                }
                else{
                    if (result.response) {
                        await this.setState({isLoading: false});
                        this.props.fetchErrorExpediente(result.response.data);
                        return false;
                    }
                    else {
                        await this.setState({isLoading: false});
                        this.props.fetchErrorExpediente(result.data);
                        return false;
                    }
                }
            }
        }

    }catch (e) {
        await this.setState({isLoading: false});
        this.props.fetchErrorExpediente(formatMenssage(e.message));
    }

  }

  updateEncomenda(encomenda) {
    this.setState({ encomenda: encomenda });
  }

  async crearTrabajo() {
    if (await this.addTrabajoEncomenda()) {
      this.props.history.push(`/crear-trabajo/${this.props.match.params.id}`);
    }
  }

    handleClose = () => {
        this.setState({ isLoading: false });
    };

  render() {
    let { classes } = this.props;
    return (
      <Container className={classes.margin}>
        <Grid item xs={12} className="min-height-panel">
          <ExpansionPanel expanded={true}>
            <ExpansionPanelSummary style={{ minHeight: 48, height: 48 }}
              className={classes.titleMainPanel}>
              <div>
                <Translate id="languages.agentes.agentSectionTitle" />
              </div>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Grid container spacing={24}>
                <Grid item md={6} xs={12} className={classes.marginPanel}>
                  <Arquitecto classes={this.styles} encomenda={this.state.encomenda} updateEncomenda={(encomenda) => this.updateEncomenda(encomenda)} />
                </Grid>
                <Grid item md={6} xs={12} className={classes.marginPanel}>
                  <Promotores encomenda={this.state.encomenda} updateEncomenda={(encomenda) => this.updateEncomenda(encomenda)} />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={12} className="py-2">
          <Button variant="contained" size="small" color="primary" className="float-right px-3 ml-2"
            onClick={() => this.crearTrabajo()}>
            <Translate id="languages.generalButton.crearTrabajo" />
          </Button>
          <Button variant="contained" size="small" color="primary" className="float-right px-3"
            onClick={() => this.addTrabajoEncomenda()}>
            <Translate id="languages.generalButton.finalizar" />
          </Button>
          <Button color="primary" size="small" className="float-right mx-2">
            <Translate id="languages.generalButton.cancel" /><Close className={classes.rightIcon} />
          </Button>
          <Button color="primary" size="small" className="float-left px-4" onClick={() => { this.props.handleBack() }}>
            <Translate id="languages.generalButton.volver" />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Dialog
              disableBackdropClick
              disableEscapeKeyDown
              open={this.state.isLoading}
              onClose={this.handleClose}
          >
              <DialogContent>
                <CircularProgress/>
              </DialogContent>
          </Dialog>
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
  funcionesTipologicas: state.trabajos.funcionesTipologia.data ? state.trabajos.funcionesTipologia.data.Tipos_Trabajos_Tunciones : [],
  currentExpediente: state.expedientes.ExpedientNew ? state.expedientes.ExpedientNew : {},
  state: state
})

const mapDispatchToProps = {
  postAddTrabajoEncomenda: postAddTrabajoEncomenda,
  fetchErrorExpediente
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Agentes)));