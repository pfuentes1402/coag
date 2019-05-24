import React, { Component } from 'react';
import {
  AppBar, Toolbar, withStyles, Grid, Button, Collapse,
  ListItemText, Divider
} from '@material-ui/core';
import {
  Close, FileCopy, CancelPresentation, CloudDownload, ExpandLess,
  ExpandMore, CloudUpload, Notifications, Check
} from '@material-ui/icons';
import { List, ListItem, ListSubheader, CircularProgress } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import PropTypes from 'prop-types';
import './index.css';
import { withRouter } from 'react-router-dom';
import TrabajoComunicacion from './Trabajos/ComunicacionEncargo/index';
import TrabajoEjecucion from './Trabajos/ProyectoEjecucion/index';
import MenuOption from './Trabajos/ProyectoEjecucion/menuProyectoEjecucion';
import {
  getExpedienteDatosGeneral, getEstructuraDocumental,
  moveFileFromTemporalToStructure, deleteExpediente,
  postExpedienteAccion, deleteTrabajo, closeTrabajo,
  moveFileToStructure
} from '../../api';
import { fetchErrorExpediente, formatMenssage } from "../../actions/expedientes";
import { groupBy, filter } from 'lodash';
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import ExpedienteGeneral from "./Trabajos/ComunicacionEncargo/general";
import Dropzone from "react-dropzone";
import * as actionsExpedientes from '../../actions/expedientes';
import Confirmation from "../Errors/confirmation";

const styles = theme => ({
  fichaExpediente: {
    backgroundColor: theme.palette.primary.main,
    color: "white"
  },
  root: {
    flexGrow: 1,
    overflowX: 'auto',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  main: {
    height: 900
  },
  mainNav: {
    boxShadow: "none",
    flexDirection: "row-reverse"
  },
  button: {
    margin: 0,
    padding: "8px 12px",
    fontSize: 13
  },
  headerNav: {
    margin: "auto",
    borderBottom: "solid 1px " + grey[300],
    position: "relative",
    cursor: "pointer",
    lineHeight: 2,
    fontSize: 16
  },
  leftNav: {
    flexGrow: 1,
    height: 50
  },
  backgroundGrey: {
    backgroundColor: grey[100]
  },
  boredrRight: {
    borderRight: "1.5px solid #CCC",
  }

});

class VisualizarExpediente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      renderComponent: "TrabajoComunicacion",
      expediente: null,
      currentExpediente: null,
      idTrabajoActivo: null,
      idEstructuraActiva: null,
      estructurasAbiertas: [],
      titleEstructuraActiva: "",
      estructuraActiva: null,
      estructuraDocumental: [],
      estructurasPadre: [],
      isLoadEstructura: false,
      active: false,
      optionsComponent: this.props.match.params.idTrabajo ? 2 : 1, //Indica si lo seleccionado en Expediente(1), Trabajo(2), Estructura(3)
      presentWork: false,
      openConfirmationWork: false,
      openConfirmationExpedient: false
    };
    this.menuLateral = React.createRef()
  }

  async componentWillMount() {
    await this.fetchExpediente();
  }

  switcToolbar(option) {
    this.setState({ optionsComponent: option });
  }

  //Consumir api con el id de expediente espicificado por ur
  async fetchExpediente() {
    let response = await getExpedienteDatosGeneral(this.props.match.params.id);
    //1- Disparar el error del server
    if (response.data && response.data.MensajesProcesado && response.data.MensajesProcesado.length > 0) {
      this.props.fetchErrorExpediente(response.data);
      return;
    }
    //2- Error 500
    else if (response.response) {
      this.props.fetchErrorExpediente(response.response.data);
      return;
    }

    //3- Success
    else if (response.data) {
      let expediente = response.data;
      let currentExpediente = expediente.Expediente.length > 0 ? expediente.Expediente[0] : null;
      let activeTrabajo = this.props.match.params.idTrabajo
        ? this.props.match.params.idTrabajo
        : null;

      await this.setState({
        expediente: expediente,
        currentExpediente: currentExpediente,
        idTrabajoActivo: activeTrabajo
      });
      await this.handleChangeMenuOption(null);
      let idEstructura = this.props.match.params.idEstructura
      if (idEstructura) {

        let { estructurasPadre } = this.state;
        if (estructurasPadre && estructurasPadre.length > 0) {
          let estr = estructurasPadre.filter(item => item.Id_Estructura == idEstructura)
          if (estr.length == 1)
            await this.handleChangeEstructuran(idEstructura, estr[0].Titulo, estr[0]);
          console.log('menu', this.menuLateral)
        }

      }


    }
  }

  updateExpediente(expedienteData) {
    if (expedienteData) {
      this.setState({
        expediente: expedienteData,
        currentExpediente: expedienteData.Expediente.length > 0 ? expedienteData.Expediente[0] : null
      })
    }
  }


  handleExpandMenu() {
    this.setState(state => ({ open: !state.open }));
  };

  async getEstructuraDocumental(idExpediente, idTrabajo, showLoading = true) {
    if (showLoading)
      await this.setState({ isLoadEstructura: true });
    if (idExpediente === null)
      return false;
    let estructurasNivel2 = [];
    let groupEstructura = [];
    let estructurasNivel1 = [];
    let estructuraChildrens = {};
    try {
      let response = await getEstructuraDocumental(idExpediente, idTrabajo, this.props.activeLanguage.code);
      if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
        this.props.fetchErrorExpediente(response);
        await this.setState({ isLoadEstructura: false, estructuraDocumental: [] });
      }
      else {
        estructurasNivel1 = filter(response.EstructurasDocumentales, { "Nivel_Documentacion": 1 });
        estructurasNivel2 = filter(response.EstructurasDocumentales, { "Nivel_Documentacion": 2 });
        groupEstructura = groupBy(estructurasNivel2, "Titulo_Padre");
        for (let i = 0; i < estructurasNivel1.length; i++) {
          estructuraChildrens[estructurasNivel1[i].Titulo] = groupEstructura[estructurasNivel1[i].Titulo] ? groupEstructura[estructurasNivel1[i].Titulo] : estructurasNivel1[i];
        }
        await this.setState({ estructuraDocumental: estructuraChildrens, estructurasPadre: estructurasNivel1, isLoadEstructura: false });
      }
      return { estructuraDocumental: estructuraChildrens, estructurasPadre: estructurasNivel1 };
    }
    catch (e) {
      this.props.fetchErrorExpediente(formatMenssage(e.message));
      await this.setState({ isLoadEstructura: false });
      return { estructuraDocumental: [], estructurasPadre: [] };
    }
  }

  async handleChangeMenuOption(idTrabajo, showLoading = true) {
    let active = this.state.active == idTrabajo ? -1 : idTrabajo;

    if (this.state.currentExpediente) {
      if (showLoading) {
        if (null === idTrabajo) {
          await this.setState({
            renderComponent: "ExpedienteGeneral",
            idTrabajoActivo: idTrabajo,
            idEstructuraActiva: null,
            titleEstructuraActiva: "",
            estructuraActiva: null,
            active: active
          });
        } else {
          if (this.state.currentExpediente.Id_Trabajo_Encomenda_Actual == idTrabajo) {
            await this.setState({
              renderComponent: "TrabajoComunicacion",
              idTrabajoActivo: idTrabajo,
              idEstructuraActiva: null,
              titleEstructuraActiva: "",
              estructuraActiva: null,
              active: active
            });
          } else {
            await this.setState({
              renderComponent: "TrabajoEjecucion",
              idTrabajoActivo: idTrabajo,
              idEstructuraActiva: null,
              titleEstructuraActiva: "",
              estructuraActiva: null,
              active: active
            });
          }
        }
      }

      if (idTrabajo)
        await this.getEstructuraDocumental(this.state.currentExpediente.Id_Expediente, idTrabajo, showLoading);
    }
  }

  setWorkSpaceToTrabajoEjecucion = (idTrabajo) => {
    this.setState({
      renderComponent: "TrabajoEjecucion",
      idTrabajoActivo: idTrabajo
    });
  }

  handleTrabajoComunicacion() {
    this.setState({
      idTrabajoActivo: null,
      active: false,
      renderComponent: "ExpedienteGeneral",
      idEstructuraActiva: null,
      titleEstructuraActiva: "",
      estructuraActiva: null
    });
    this.switcToolbar(1);
  }

  async handleChangeEstructuran(idEstructura, titleEstructura, estructura = false) {
    if (!estructura) {
      Object.values(this.state.estructuraDocumental).map((mayores, p) => {
        if (mayores[0]) {
          Object.values(mayores).map(item => {
            if (item.Id_Estructura == idEstructura) {
              estructura = item
            }
          })
        } else {
          if (mayores.Id_Estructura == idEstructura) {
            estructura = mayores
          }
        }
      })
    }
    await this.setState({ idEstructuraActiva: idEstructura, titleEstructuraActiva: titleEstructura, estructuraActiva: estructura });
  }

  getLi = async () => {
    let response = await postExpedienteAccion(this.props.match.params.id, 4, 0);
    if (response.InfoAccion && response.InfoAccion.length > 0) {
      let url = response.InfoAccion[0].Url;
      url = url.replace(" ", "");
      window.open(url, '_blank');
    }
    if (response.MensajesProcesado && response.MensajesProcesado.length > 0)
      this.props.fetchErrorExpediente(response);
    else
      this.props.fetchErrorExpediente(
        formatMenssage(<Translate id="languages.messages.noLi" />));
  }

  presentTrabajo = async () => {
    this.setState({ presentWork: true });
    let result = await closeTrabajo(this.props.match.params.id, this.state.idTrabajoActivo);
    if (result.MensajesProcesado && result.MensajesProcesado.length > 0)
      this.props.fetchErrorExpediente(result);
    else {
      this.props.history.push(`/visualizar-expediente/${this.props.match.params.id}`);
    }
    this.setState({ presentWork: false });
  }

  getLoa = async () => {
    let response = await postExpedienteAccion(this.props.match.params.id, 3, 0);
    if (response.InfoAccion && response.InfoAccion.length > 0) {
      let url = response.InfoAccion[0].Url;
      url = url.replace(" ", "");
      window.open(url, '_blank');
    }
    if (response.MensajesProcesado && response.MensajesProcesado.length > 0)
      this.props.fetchErrorExpediente(response);
    else
      this.props.fetchErrorExpediente(
        formatMenssage(<Translate id="languages.messages.noLoa" />));
  }

  deleteTrabajoExpediente = async () => {
    let response = await deleteTrabajo(this.props.match.params.id, this.state.idTrabajoActivo);
    if (response.MensajesProcesado && response.MensajesProcesado.length > 0)
      this.props.fetchErrorExpediente(response);
    else
      this.props.history.push(`/visualizar-expediente/${this.props.match.params.id}`);
  }

  deleteExpedient = async () => {
    let result = await deleteExpediente(this.props.match.params.id);
    if (result && result.MensajesProcesado && result.MensajesProcesado.length === 0)
      this.props.history.push("/");
    else {
      this.props.fetchErrorExpediente(result);
    }
  }

  async onDrop(acceptedFiles) {
    let expediente = this.state.expediente.Expediente[0];
    let estructura = this.state.idEstructuraActiva ? { id: this.state.idEstructuraActiva } : false;
    if (estructura) {
      await this.props.uploadFiles(acceptedFiles, true, expediente, this.state.idTrabajoActivo, estructura)
    } else {
      await this.props.uploadFiles(acceptedFiles, false, expediente, this.state.idTrabajoActivo)
    }
  }

  disableActions = () => {
    if (!this.state.idEstructuraActiva) {
      return true
    }
    if (this.state.idTrabajoActivo) {
      let trabajoActivo = this.state.expediente.Trabajos
        ? this.state.expediente.Trabajos.find(x => x.Id_Trabajo === parseInt(this.state.idTrabajoActivo))
        : null;
      if (trabajoActivo) {
        if (trabajoActivo.Entrega_Cerrada === 1)
          return true;
        else {
          if (this.state.estructuraActiva !== null) {
            let disable = this.state.estructuraActiva.Permite_Anexar_Archivos === 0;
            return disable;
          }
          return false;
        }
      }
      return true;
    }
    return false;
  }

  openConfirmation = (isWork) => {
    this.setState({ openConfirmationWork: isWork, openConfirmationExpedient: !isWork });
  }

  renderConfirmation() {
    return (this.state.openConfirmationWork
      ? <Confirmation openConfirmation={this.state.openConfirmationWork}
        confirmationMessage={<Translate id="languages.messages.workConfirmation" />}
        aceptConfirmation={async () => {
          await this.deleteTrabajoExpediente();
          this.setState({ openConfirmationWork: false })
        }}
        declineConfirmation={() => this.setState({ openConfirmationWork: false })} />
      : this.state.openConfirmationExpedient
        ? <Confirmation openConfirmation={this.state.openConfirmationExpedient}
          confirmationMessage={<Translate id="languages.messages.expedientConfirmation" />}
          aceptConfirmation={async () => {
            await this.deleteExpedient();
            this.setState({ openConfirmationExpedient: false });
          }}
          declineConfirmation={() => this.setState({ openConfirmationExpedient: false })} />
        : <div></div>
    );
  }

  renderNavBar() {
    let { classes } = this.props;
    let disableActions = this.disableActions();
    let trabajoActual = this.state.expediente ? this.state.expediente.Trabajos.find(t => t.Id_Trabajo == this.state.idTrabajoActivo) : {};
    trabajoActual = trabajoActual ? trabajoActual : {};
    return (
      <div className={classes.root}>
        <AppBar position="static" className={`${classes.mainNav} nav-expedient`} color="default">
          {this.state.optionsComponent === 1
            ? <Toolbar>
              <Button color="primary" className={classes.button}
                onClick={() => this.openConfirmation(false)}>
                <Translate id="languages.generalButton.delete" /><Close />
              </Button>
              <Button color="primary" className={classes.button}
                onClick={this.getLi}>
                <Translate id="languages.generalButton.getli" /><FileCopy className="ml-1" />
              </Button>
              <Button color="primary" className={classes.button}
                onClick={this.getLoa}>
                <Translate id="languages.generalButton.getloa" /><FileCopy className="ml-1" />
              </Button>
              <Button className={classes.button} disabled={true}>
                <Translate id="languages.generalButton.cancelbuild" /><CancelPresentation className="ml-1" />
              </Button>
              <Button disabled={true} color="primary" className={classes.button}>
                <Translate id="languages.generalButton.download" /> <CloudDownload className="ml-1" />
              </Button>
            </Toolbar>
            : this.state.optionsComponent === 2
              ? <Toolbar>
                {
                  this.props.fileUpload.uploadInProgress ? null :
                    <Dropzone style={{
                      width: 'auto',
                      height: 'auto',
                      borderStyle: 'none'
                    }}
                      disabled={disableActions}
                      accept="application/pdf"
                      onDrop={(acceptedFiles) => this.onDrop(acceptedFiles)}>
                      <Button color="primary" disabled={disableActions}>
                        <Translate id="languages.fileUpload.addFiles" /> <CloudUpload
                          style={{ marginLeft: 5 }} />
                      </Button>
                    </Dropzone>
                }
                <Button color="primary" className={classes.button}
                  disabled={trabajoActual.SePuede_Eliminar === 0}
                  onClick={() => this.openConfirmation(true)}>
                  <Translate id="languages.generalButton.delete" /><Close />
                </Button>
                <Button color="primary" className={classes.button} disabled={true}>
                  <Translate id="languages.generalButton.urgent" /><Notifications />
                </Button>
                <Button disabled={this.state.presentWork || trabajoActual.SePuede_Entregar === 0}
                  color="primary" className={classes.button}
                  onClick={this.presentTrabajo}>
                  <Translate id="languages.generalButton.present" /><Check />
                </Button>
              </Toolbar>
              : <Toolbar style={{ width: "100%", textAlign: "right" }}>
                {
                  this.props.fileUpload.uploadInProgress ? null :
                    <Dropzone style={{
                      width: "100%",
                      height: 'auto',
                      borderStyle: 'none',
                      float: "right"
                    }}
                      disabled={disableActions}
                      accept="application/pdf"
                      onDrop={(acceptedFiles) => this.onDrop(acceptedFiles)}>
                      <Button color="primary" disabled={disableActions}>
                        <Translate id="languages.fileUpload.addFiles" /> <CloudUpload
                          style={{ marginLeft: 5 }} />
                      </Button>
                    </Dropzone>
                }
              </Toolbar>}
        </AppBar>
      </div>
    );
  }

  renderLeftNav() {
    let { classes } = this.props;
    return (
      <List component="nav" className={classes.leftNav}
        subheader={<ListSubheader component="div" className={`${classes.headerNav} py-3 ${this.state.idTrabajoActivo === null ? classes.fichaExpediente : ''}`}
          onClick={() => this.handleTrabajoComunicacion()}>
          {`${this.state.currentExpediente.Expediente_Codigo_Estudio} ${this.state.currentExpediente.Titulo}`}
        </ListSubheader>}>
        <ListItem button onClick={() => { this.handleExpandMenu() }} className="pl-3 " >
          <ListItemText inset primary={<Translate id="languages.fichaExpediente.titleListaTrabajos" />} className="pl-0" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Divider />
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {this.state.expediente.Trabajos.map((trabajo, index) => {
              return <MenuOption key={`menu_item_${index}`}

                changeOption={(idTrabajo) => {
                  this.handleChangeMenuOption(idTrabajo, true);
                  this.switcToolbar(2);
                }}

                defaultEstructura={this.state.titleEstructura}
                changeEstructura={(idEstructura, titleEstructura, estructura) => {
                  this.handleChangeEstructuran(idEstructura, titleEstructura, estructura);
                  this.switcToolbar(3);
                }}

                expediente={this.state.expediente}
                trabajo={trabajo}
                dragTarget={this.state.dragging ? this.state.dragging : false}
                moveItemTo={(target) => this.moveItemTo(target)}
                estructuraDocumental={this.state.estructuraDocumental}
                estructurasPadre={this.state.estructurasPadre}
                idEstructuraActiva={this.state.idEstructuraActiva}
                isLoadEstructura={this.state.isLoadEstructura}
                active={this.state.active == trabajo.Id_Trabajo}
                activeTrabajo={this.state.idTrabajoActivo}
                getEstructuraDocumental={(idExpediente, idTrabajo, showLoading) => this.getEstructuraDocumental(idExpediente, idTrabajo, showLoading)}
                setTrabajoActivo={(idTrabajo) => this.setTrabajoActivo(idTrabajo)}
                setWorkSpaceToTrabajoEjecucion={(idTrabajo) => this.setWorkSpaceToTrabajoEjecucion(idTrabajo)}
              />
            })}
          </List>
        </Collapse>
      </List>
    );
  }

  setTrabajoActivo = (idTrabajo) => {
    this.setState({ idTrabajoActivo: idTrabajo });
  }

  async moveItemTo(target) {
    let item = this.state.dragging
    try {
      if (item.temporalFiles) {
        await this.moveFileToTemporal(target, item.temporalFiles);
        await this.moveFileToEstructure(target, item.files);
      }
      else {
        await this.moveFileTo(target, item);
      }
      await this.refreshTree()
      return true
    } catch (error) {
      this.props.fetchErrorExpediente("Error de comunicación con la API");
      return false
    }
  }

  async refreshTree() {
    this.handleChangeMenuOption(this.state.idTrabajoActivo, false)
  }

  async moveFileTo(target, item) {
    let response = await moveFileFromTemporalToStructure(target.Id_Expediente, target.Id_Trabajo, target.Id_Estructura, item.Nombre)
    if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
      this.props.fetchErrorExpediente(response);
      return false
    } else {
      return true
    }
  }

  async moveFileToTemporal(target, files) {
    for (let i = 0; i < files.length; i++) {
      let element = files[i];
      await this.moveFileTo(target, element)
    }
  }

  async moveFileToEstructure(target, files) {
    if (files.length === 0) {

      return true;
    }
    let dataPost = { Archivos: files.map(element => { return { id_estructura: element.Id_Estructura } }) };
    let response = await moveFileToStructure(target.Id_Expediente,
      target.Id_Trabajo, target.Id_Estructura, dataPost);
    if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
      this.props.fetchErrorExpediente(response);
      return false
    } else {
      return true
    }
  }

  dragging(action) {
    this.setState({ dragging: action })
  }

  render() {
    let { classes } = this.props;
    let { expediente } = this.state;
    let trabajoActual = this.state.expediente ? this.state.expediente.Trabajos.find(t => t.Id_Trabajo == this.state.idTrabajoActivo) : null; /*Por favor no cambiar los == asi está bien*/
    let disableActions = this.disableActions();

    return (
      this.state.expediente
        ? <Grid container>
          <Grid item xs={12}>

            <BreadcrumbsItem key={1} to={'/visualizar-expediente/' + this.state.currentExpediente.Id_Expediente}
              className="title-breadcrumb">
              {(this.state.currentExpediente.Expediente_Codigo ? this.state.currentExpediente.Expediente_Codigo : this.state.currentExpediente.Expediente_Codigo_Estudio) + (this.state.renderComponent === "TrabajoComunicacion" || this.state.renderComponent === "ExpedienteGeneral" ? ` ${this.state.currentExpediente.Titulo}` : "")}
            </BreadcrumbsItem>
            {
              (this.state.idTrabajoActivo && this.state.renderComponent !== "TrabajoComunicacion")
                ? <BreadcrumbsItem key={2} to={'/visualizar-expediente/' + this.state.currentExpediente.Id_Expediente + "/" + this.state.idTrabajoActivo}
                  className="title-breadcrumb">
                  {trabajoActual ? trabajoActual.Titulo : ""}
                </BreadcrumbsItem>
                : ""
            }
            {this.state.estructuraActiva && this.state.estructuraActiva.Nivel_Documentacion === 2
              ? <BreadcrumbsItem to={'/visualizar-expediente/' + this.state.currentExpediente.Id_Expediente + "/" + this.state.idTrabajoActivo + "/" + this.state.estructuraActiva.Id_Estructura_Padre} key={3}
                className="title-breadcrumb">
                {this.state.estructuraActiva.Titulo_Padre}
              </BreadcrumbsItem> : ""}

            {(this.state.titleEstructuraActiva && this.state.renderComponent !== "TrabajoComunicacion")
              ? <BreadcrumbsItem key={4} to={'/visualizar-expediente/' + this.state.currentExpediente.Id_Expediente + "/" + this.state.idTrabajoActivo + "/" + this.state.estructuraActiva.Id_Estructura_Padre + "/" + this.state.Id_Estructura}>
                {this.state.titleEstructuraActiva}
              </BreadcrumbsItem>
              : ""}
          </Grid>
          <Grid item md={3} xs={12} style={{ height: window.innerHeight * .8, overflow: "hidden", maxWidth: "22%" }} className={classes.boredrRight}>
            <div style={{ width: '107%', height: window.innerHeight * .8 + 10, overflowX: 'hidden', overflow: 'scroll' }}>
              {this.renderLeftNav()}
            </div>

          </Grid>
          <Grid item md={9} xs={12} className={classes.backgroundGrey} style={{ padding: "0 15px", minWidth: "78%" }}>
            {this.renderNavBar()}
            {
              this.state.renderComponent === "TrabajoComunicacion"
                ? <TrabajoComunicacion expediente={expediente} />
                : (this.state.renderComponent === "ExpedienteGeneral"
                  ? <ExpedienteGeneral expediente={expediente}
                    dragging={(state) => this.dragging(state)}
                    changeEstructura={(idTrabajo) => {
                      this.handleChangeMenuOption(idTrabajo);
                      this.switcToolbar(2);
                    }}

                    updateExpediente={(expediente) => this.updateExpediente(expediente)} />
                  : <TrabajoEjecucion
                    key={this.state.idTrabajoActivo + (this.state.idEstructuraActiva ? this.state.idEstructuraActiva : "")}
                    expediente={expediente}
                    trabajo={this.state.idTrabajoActivo}
                    dragging={(state) => this.dragging(state)}
                    isDragging={this.state.dragging}
                    refreshTree={() => {
                      this.refreshTree()
                    }}
                    changeEstructura={(idEstructura, titleEstructura) => {
                      this.handleChangeEstructuran(idEstructura, titleEstructura);
                      this.switcToolbar(3);
                    }}
                    estructura={this.state.idEstructuraActiva ? { id: this.state.idEstructuraActiva } : false}
                    disableActions={disableActions} />)
            }
          </Grid>

          <Grid item xs={12}>
            {this.renderConfirmation()}
          </Grid>
        </Grid>
        : <div className="text-center my-5">
          <CircularProgress />
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  fileUpload: state.status.files
})

const mapDispatchToProps = {
  fetchErrorExpediente: fetchErrorExpediente,
  uploadFiles: actionsExpedientes.uploadFiles,
};

VisualizarExpediente.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(VisualizarExpediente))));