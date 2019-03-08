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
  postExpedienteAccion, deleteTrabajo
} from '../../api';
import { fetchErrorExpediente, formatMenssage } from "../../actions/expedientes";
import { groupBy, filter } from 'lodash';
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import ExpedienteGeneral from "./Trabajos/ComunicacionEncargo/general";

const styles = theme => ({
  fichaExpediente:{
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
      idTrabajoActivo: null/*this.props.match.params.idTrabajo*/,
      idEstructuraActiva: null,
      estructurasAbiertas:[],
      titleEstructuraActiva: "",
      estructuraDocumental: [],
      estructurasPadre: [],
      isLoadEstructura: false,
      active: false,
      optionsComponent: this.props.match.params.idTrabajo ? 2 : 1 //Indica si lo seleccionado en Expediente(1), Trabajo(2), Estructura(3)
    };
  }

   componentWillMount() {
     this.fetchExpediente();
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
        /*: currentExpediente
          ? currentExpediente.Id_Trabajo_Encomenda_Actual*/
          : null;

      await this.setState({
        expediente: expediente,
        currentExpediente: currentExpediente,
        idTrabajoActivo: activeTrabajo
      });
      this.handleChangeMenuOption(activeTrabajo);
    }
  }


  handleExpandMenu = () => {
    this.setState(state => ({ open: !state.open }));
  };

  async getEstructuraDocumental(idExpediente, idTrabajo){

      await this.setState({isLoadEstructura: true});
      if(idExpediente ===null)
          return false;
      let filterEstructura = [];
      let groupEstructura = [];
      let estructurasNivel1 = []
      try {

          let response = await getEstructuraDocumental(idExpediente, idTrabajo,this.props.activeLanguage.code);
          if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
              this.props.fetchErrorExpediente(response);
              await this.setState({isLoadEstructura: false, estructuraDocumental: []});
          }
          else {
              filterEstructura = filter(response.EstructurasDocumentales, {"Id_Tipo_Estructura": 1});
              estructurasNivel1 = filter(response.EstructurasDocumentales, {"Nivel_Documentacion": 1});
              groupEstructura = groupBy(filterEstructura, "Titulo_Padre");
              await this.setState({estructuraDocumental: groupEstructura, estructurasPadre: estructurasNivel1, isLoadEstructura: false});
          }
      }
      catch (e) {
          this.props.fetchErrorExpediente(formatMenssage(e.message));
          await this.setState({isLoadEstructura: false});
      }
  }

  async handleChangeMenuOption(idTrabajo) {
    let active = this.state.active == idTrabajo ? -1 : idTrabajo;
    if (this.state.currentExpediente) {
      if (null === idTrabajo) {
        await this.setState({
          renderComponent: "ExpedienteGeneral",
          idTrabajoActivo: idTrabajo,
          idEstructuraActiva: null,
            titleEstructuraActiva: "",
            active: active
        });
      } else {
        if (this.state.currentExpediente.Id_Trabajo_Encomenda_Actual == idTrabajo) {
          await this.setState({
            renderComponent: "TrabajoComunicacion",
            idTrabajoActivo: idTrabajo,
            idEstructuraActiva: null,
            titleEstructuraActiva: "",
            active: active
          });
        } else {
          await this.setState({
            renderComponent: "TrabajoEjecucion",
            idTrabajoActivo: idTrabajo,
            idEstructuraActiva: null,
            titleEstructuraActiva: "",
            active: active
          });
        }

      }
      await this.getEstructuraDocumental(this.state.currentExpediente.Id_Expediente, idTrabajo);
    }
  }

  handleTrabajoComunicacion() {
    this.setState({
      idTrabajoActivo: null,
      active: false,
      renderComponent: "ExpedienteGeneral",
      idEstructuraActiva: null,
      titleEstructuraActiva: "",

    });
    this.switcToolbar(1);
  }

  async handleChangeEstructuran(idEstructura, titleEstructura) {
    await this.setState({ idEstructuraActiva: idEstructura, titleEstructuraActiva: titleEstructura });
  }

  getLi = async () => {
    let response = await postExpedienteAccion(this.props.match.params.id, 4, 0);
    if (response.InfoAccion && response.InfoAccion.length > 0)
      window.open(response.InfoAccion[0].Url, '_blank');
    if (response.MensajesProcesado && response.MensajesProcesado.length > 0)
      this.props.fetchErrorExpediente(response);
    else
      this.props.fetchErrorExpediente(
        formatMenssage(<Translate id="languages.messages.noLi" />));
  }

  getLoa = async () => {
    let response = await postExpedienteAccion(this.props.match.params.id, 3, 0);
    if (response.InfoAccion && response.InfoAccion.length > 0)
      window.open(response.InfoAccion[0].Url, '_blank');
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

  renderNavBar() {
    let { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" className={`${classes.mainNav} nav-expedient`} color="default">
          {this.state.optionsComponent === 1
            ? <Toolbar>
              <Button color="primary" className={classes.button}
                onClick={this.deleteExpedient}>
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
              <Button color="primary" className={classes.button}>
                <Translate id="languages.generalButton.download" /> <CloudDownload className="ml-1" />
              </Button>
            </Toolbar>
            : this.state.optionsComponent === 2
              ? <Toolbar>
                <Button color="primary" className={classes.button}>
                  <Translate id="languages.generalButton.uploadFile" /><CloudUpload />
                </Button>
                <Button color="primary" className={classes.button}
                  onClick={this.deleteTrabajoExpediente}>
                  <Translate id="languages.generalButton.delete" /><Close />
                </Button>
                <Button color="primary" className={classes.button} disabled={true}>
                  <Translate id="languages.generalButton.urgent" /><Notifications />
                </Button>
                <Button color="primary" className={classes.button} disabled={true}>
                  <Translate id="languages.generalButton.present" /><Check />
                </Button>
              </Toolbar>
              : <Toolbar>
                <Button color="primary" className={classes.button}>
                  <Translate id="languages.fileUpload.addFiles" /><CloudUpload className="mx-2" />
                </Button>
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
          onClick={()=>this.handleTrabajoComunicacion()}>
          {`${this.state.currentExpediente.Expediente_Codigo_Estudio} ${this.state.currentExpediente.Titulo}`}
        </ListSubheader>}>
        <ListItem button onClick={this.handleExpandMenu} className="pl-3 pr-2">
          <ListItemText inset primary={<Translate id="languages.fichaExpediente.titleListaTrabajos" />} className="pl-0" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Divider />
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {this.state.expediente.Trabajos.map((trabajo, index) => {
              return <MenuOption key={index}
                changeOption={(idTrabajo) => {
                  this.handleChangeMenuOption(idTrabajo);
                  this.switcToolbar(2);
                }}
                changeEstructura={(idEstructura, titleEstructura) => {
                  this.handleChangeEstructuran(idEstructura, titleEstructura);
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
              />
            })}
          </List>
        </Collapse>
      </List>
    );
  }
    async moveItemTo(target) {

        let item = this.state.dragging
        try {
            let response = await moveFileFromTemporalToStructure(target.Id_Expediente, target.Id_Trabajo, target.Id_Estructura, item.Nombre)
            if (response.MensajesProcesado && response.MensajesProcesado.length > 0) {
                this.props.fetchErrorExpediente(response);
                return false
            }else{
                return true
            }
        } catch (error) {
            this.props.fetchErrorExpediente("Error de comunicación con la API");
            return false
        }

    }
  dragging(action) {
        this.setState({dragging: action})
  }
  render() {
    let { classes } = this.props;
    let { expediente } = this.state;
    let trabajoActual= this.state.expediente ? this.state.expediente.Trabajos.find(t=>t.Id_Trabajo == this.state.idTrabajoActivo) : null; /*Por favor no cambiar los == asi está bien*/
    return (
      this.state.expediente
        ? <Grid container>
              <Grid item xs={12}>
                  <BreadcrumbsItem to={'/visualizar-expediente/' + this.state.currentExpediente.Id_Expediente}>
                      {this.state.currentExpediente.Expediente_Codigo_Estudio + (this.state.renderComponent === "TrabajoComunicacion" || this.state.renderComponent === "ExpedienteGeneral" ? ` ${this.state.currentExpediente.Titulo}` : "")}
                      </BreadcrumbsItem>
                  {
                      (this.state.idTrabajoActivo && this.state.renderComponent !== "TrabajoComunicacion")
                      ?     <BreadcrumbsItem to={'/visualizar-expediente/' + this.state.currentExpediente.Id_Expediente + "/" + this.state.idTrabajoActivo}>
                              {trabajoActual ? trabajoActual.Titulo : ""}
                              </BreadcrumbsItem>
                        : ""
                  }
                  {(this.state.titleEstructuraActiva && this.state.renderComponent !== "TrabajoComunicacion")
                      ?     <BreadcrumbsItem to={'/visualizar-expediente/' + this.state.currentExpediente.Id_Expediente + "/" + this.state.idTrabajoActivo + "/" + this.state.idEstructuraActiva}>
                          {this.state.titleEstructuraActiva}
                      </BreadcrumbsItem>
                      : ""}

          </Grid>
          <Grid item md={3} xs={12} className={classes.boredrRight}>
            {this.renderLeftNav()}
          </Grid>
          <Grid item md={9} xs={12} className={classes.backgroundGrey}>
            {this.renderNavBar()}
            {
              this.state.renderComponent === "TrabajoComunicacion"
                ? <TrabajoComunicacion expediente={expediente} />
                : (this.state.renderComponent === "ExpedienteGeneral" ?
                  <ExpedienteGeneral expediente={expediente} /> :
                  <TrabajoEjecucion
                    key={this.state.idTrabajoActivo + (this.state.idEstructuraActiva ? this.state.idEstructuraActiva : "")}
                    expediente={expediente} trabajo={this.state.idTrabajoActivo}
                    dragging={(state) => this.dragging(state)}
                    estructura={this.state.idEstructuraActiva ? { id: this.state.idEstructuraActiva } : false} />)
            }
          </Grid>

        </Grid>
        : <div className="text-center my-5">
          <CircularProgress />
        </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {
    fetchErrorExpediente: fetchErrorExpediente
};

VisualizarExpediente.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(VisualizarExpediente))));