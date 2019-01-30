import React, { Component } from 'react';
import {
  AppBar, Toolbar, Typography, withStyles, Grid, Button, Collapse,
  ListItemText, Divider
} from '@material-ui/core';
import {
  Close, FileCopy, CancelPresentation, CloudDownload, ExpandLess,
  ExpandMore
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
import { getExpedienteDatosGeneral } from '../../api';

const styles = theme => ({
  root: {
    flexGrow: 1,
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
    background: "#ffffff",
    backgroundColor: "#ffffff"
  },
  button: {
    margin: 0,
    padding: "8px 12px",
    fontSize: 13
  },
  headerNav: {
    background: theme.palette.primary.main,
    color: "white",
    margin: "auto",
    textAlign: "center"

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
      idTrabajoActivo: this.props.match.params.idTrabajo
    };
  }

  async componentWillMount() {
    await this.fetchExpediente();
  }

  //Consumir api con el id de expediente espicificado por ur
  async fetchExpediente() {
    let response = await getExpedienteDatosGeneral(this.props.match.params.id);
    if (response.data) {
      let expediente = response.data;
      let currentExpediente = expediente.Expediente.length > 0 ? expediente.Expediente[0] : null;
      let activeTrabajo = this.props.match.params.idTrabajo
        ? this.props.match.params.idTrabajo
        : currentExpediente
          ? currentExpediente.Id_Trabajo_Encomenda_Actual
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

  async handleChangeMenuOption(idTrabajo) {
    if (this.state.currentExpediente) {
      if (this.state.currentExpediente.Id_Trabajo_Encomenda_Actual.toString() === idTrabajo.toString()) {
        await this.setState({ renderComponent: "TrabajoComunicacion", idTrabajoActivo: idTrabajo });
      }
      else {
        await this.setState({ renderComponent: "TrabajoEjecucion", idTrabajoActivo: idTrabajo });
      }
    }

  }

  renderNavBar() {
    let { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static" className={`${classes.mainNav} nav-expedient`} color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {`${this.state.currentExpediente.Id_Expediente} ${this.state.currentExpediente.Titulo}`}
            </Typography>
            <Button color="primary" className={classes.button}>
              <Translate id="languages.generalButton.delete" /><Close />
            </Button>
            <Button color="primary" className={classes.button}>
              <Translate id="languages.generalButton.getli" /><FileCopy className="ml-1" />
            </Button>
            <Button color="primary" className={classes.button}>
              <Translate id="languages.generalButton.getloa" /><FileCopy className="ml-1" />
            </Button>
            <Button className={classes.button}>
              <Translate id="languages.generalButton.cancelbuild" /><CancelPresentation className="ml-1" />
            </Button>
            <Button color="primary" className={classes.button}>
              <Translate id="languages.generalButton.download" /> <CloudDownload className="ml-1" />
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
  renderLeftNav() {
    let { classes } = this.props;
    return (
      <List component="nav" color="primary" className={classes.leftNav}
        subheader={<ListSubheader component="div" className={`${classes.headerNav} py-3 pl-1`}
          style={{ lineHeight: 2 }}>
          {`${this.state.currentExpediente.Id_Expediente} ${this.state.currentExpediente.Titulo}`}
        </ListSubheader>}>
        <ListItem button onClick={this.handleExpandMenu} className="pl-1 pr-2">
          <ListItemText inset primary={<Translate id="languages.fichaExpediente.titleListaTrabajos" />} className="pl-0" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Divider />
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {this.state.expediente.Trabajos.map((trabajo, index) => {
              return <MenuOption key={index} changeOption={idTrabajo => this.handleChangeMenuOption(idTrabajo)}
                expediente={this.state.expediente} trabajo={trabajo}
                active={this.state.idTrabajoActivo && (this.state.idTrabajoActivo.toString() === trabajo.Id_Trabajo.toString())} />
            })}
          </List>
        </Collapse>
      </List>
    );
  }
  render() {
    let { classes } = this.props;
    let { expediente } = this.state;
    return (
      this.state.expediente
        ? <Grid container>
          <Grid item md={12} xs={12}>
            {this.renderNavBar()}
          </Grid>
          <Grid item md={3} xs={12} className={classes.boredrRight}>
            {this.renderLeftNav()}
          </Grid>
          <Grid item md={9} xs={12} className={classes.backgroundGrey}>
            {
              this.state.renderComponent === "TrabajoComunicacion"
                ? <TrabajoComunicacion expediente={expediente} />
                : this.state.renderComponent === "TrabajoEjecucion"
                  ? <TrabajoEjecucion expediente={expediente} trabajo={3}  />
                  // ? <TrabajoEjecucion expediente={expediente} trabajo={3} estructura={{id:9151681, nombre:"Memoria Construtiva"}} />
                  : <TrabajoComunicacion expediente={expediente} />
            }
          </Grid>
        </Grid>
        : <div className="text-center my-5">
          <CircularProgress />
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
};

VisualizarExpediente.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(VisualizarExpediente))));