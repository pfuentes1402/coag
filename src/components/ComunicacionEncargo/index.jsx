import React, { Component } from 'react';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import ComunicacionEncargo from './encargo';
import Agentes from '../Agentes/index';
import { Grid, CircularProgress } from '@material-ui/core';
import { fetchEncomendaActual, formatMenssage } from '../../api/index';
import { fetchErrorExpediente } from '../../actions/expedientes/index';

class Encomenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeEncargo: true,
      encomenda: null,
      isLoading: true,
    }
  }

  async componentDidMount() {
    if (this.props.match && this.props.match.params && this.props.match.params.id) {
      await this.loadEncomenda(this.props.match.params.id);
    }
    else {
      this.props.fetchErrorExpediente(formatMenssage("Error url"));
      this.setState({ isLoading: false });
    }
  }

  async loadEncomenda(idExpediente) {
    let result = await fetchEncomendaActual(idExpediente, this.props.activeLanguage.code);
    if (result.data && result.data.MensajesProcesado && result.data.MensajesProcesado.length > 0) {
      this.props.fetchErrorExpediente(result.data);
    }
    else {
      this.setState({ encomenda: result.data });
    }
    this.setState({ isLoading: false });
  }

  handleChangeComunicacionEncargo(encomenda) {
    this.setState({ encomenda: encomenda, activeEncargo: !this.state.activeEncargo });
  }

  //TODO: Consumir api para el manejo de la encomenda
  handleAddComunicacionEncargo() {

  }

  render() {
    return (
      this.state.isLoading
        ? <Grid item xs={12} className="text-center">
          <CircularProgress />
        </Grid>
        : <Grid container spacing={0}>
          <Grid item xs={12}>
            {this.state.activeEncargo && this.state.encomenda
              ? <ComunicacionEncargo encomenda={this.state.encomenda}
                handleChangeTipoExpediente={(encomenda) => { this.handleChangeComunicacionEncargo(encomenda) }} />
              : !this.state.activeEncargo && this.state.encomenda
                ? <Agentes encomenda={this.state.encomenda}
                  handleAgentes={(encomenda) => { this.handleChangeComunicacionEncargo(encomenda) }}
                  handleAddComunicacionEncargo={() => { this.handleAddComunicacionEncargo() }}
                  handleBack={() => { this.setState({ activeEncargo: true }) }} />
                : ""}
          </Grid>
        </Grid>
    );
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
  fetchErrorExpediente
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(Encomenda));