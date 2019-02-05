import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { Container } from "reactstrap";
import { CircularProgress, Grid } from '@material-ui/core';
import { fetchEncomendaActual, formatMenssage } from '../../api/index';
import { fetchErrorExpediente } from '../../actions/expedientes/index';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import TiposTrabajo from './tiposTrabajo';
import CrearTrabajo from './crearTrabajo';
import { NavLink } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";


const styles = theme => ({
  titleMainPanel: {
    borderBottom: `2px solid ${grey[100]}`
  },
  withoutRadius: {
    borderRadius: "0 !important"
  }
});

class AsistenteTrabajo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tiposTrabajos: true,
      isLoading: true,
      encomenda: null,
      trabajoSeleccion: []
    }
  }

  async componentDidMount() {
    try {
      if (this.props.match.params.id) {
        await this.loadEncomenda(this.props.match.params.id);
      }
      else {
        this.props.fetchErrorExpediente(formatMenssage("Error url"));
        this.setState({ isLoading: false });
      }
    }
    catch (error) {

    }
  }

  async loadEncomenda(idExpediente) {
    let result = await fetchEncomendaActual(idExpediente, this.props.activeLanguage.code);
    if (result.data && result.data.MensajesProcesado && result.data.MensajesProcesado.length > 0) {
      this.props.fetchErrorExpediente(result.data);
    }
    else if (result.MensajesProcesado && result.MensajesProcesado.length > 0) {
      this.props.fetchErrorExpediente(result);
    }
    else {
      this.setState({ encomenda: result.data });
    }
    this.setState({ isLoading: false });
  }

  handleNavigation(isTrabajos) {
    this.setState({ tiposTrabajos: isTrabajos });
  }

  async updateTrabajoSeleccion(trabajos) {
    await this.setState({ trabajoSeleccion: trabajos });
  }

  render() {
    let { classes } = this.props;
    return (
      this.state.isLoading ?
        <Grid item xs={12} className="text-center py-3">
          <CircularProgress />
        </Grid>
        : <Container className="my-4 px-4">
          <BreadcrumbsItem to={'/crear-trabajo/' + this.props.match.params.id} >
            <Translate id="languages.trabajo.nuevoTrabajoTitle" />
            <b style={{ padding: 6 }}> - </b>
            <NavLink to={'/visualizar-expediente/' + this.props.match.params.id}>
              <Translate id="languages.crearTrabajo.panelTitle" />
              {` ${this.props.match.params.id}`}
            </NavLink>
          </BreadcrumbsItem>
          <ExpansionPanel expanded={true} className={classes.withoutRadius}>
            <ExpansionPanelSummary className={classes.titleMainPanel}
              style={{ minHeight: 48, height: 48 }}>
              <Typography variant="title" gutterBottom className="mb-0">
                <Translate id="languages.crearTrabajo.panelTitle" />
              </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              {this.state.tiposTrabajos ?
                <TiposTrabajo encomenda={this.state.encomenda} previusSelection={this.state.trabajoSeleccion}
                  handleNavigation={isTrabajos => this.handleNavigation(isTrabajos)}
                  updateTrabajoSeleccion={seleccion => this.updateTrabajoSeleccion(seleccion)} key={1}/>

                : <CrearTrabajo handleNavigation={isTrabajos => this.handleNavigation(isTrabajos)}
                  trabajos={this.state.trabajoSeleccion} />}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Container>
    )
  }

}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  fetchErrorExpediente
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(AsistenteTrabajo)));