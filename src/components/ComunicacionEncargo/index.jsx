import React, { Component } from 'react';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import ComunicacionEncargo from './encargo';
import Agentes from '../Agentes/index';
import { Grid, CircularProgress } from '@material-ui/core';
import { fetchEncomendaActual, formatMenssage } from '../../api/index';
import { fetchErrorExpediente } from '../../actions/expedientes/index';
import {BreadcrumbsItem} from "react-breadcrumbs-dynamic";
import {NavLink} from "react-router-dom";

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
      this.props.history.push("/visualizar-expediente/" + this.props.match.params.id)
    }
    else {
      this.setState({ encomenda: result.data });
    }
    this.setState({ isLoading: false });
  }

  handleChangeComunicacionEncargo(encomenda) {
    this.setState({ encomenda: encomenda, activeEncargo: !this.state.activeEncargo });
  }

  render() {
    return (
        <div>
            {
                this.state.isLoading
                    ? <Grid item xs={12} className="text-center">
                        <CircularProgress/>
                    </Grid>
                    : <Grid container spacing={0}>
                        <BreadcrumbsItem to={'/comunicacion/' +  this.props.match.params.id} >
                            {(this.state.encomenda && this.state.encomenda.EncomendaActual && this.state.encomenda.EncomendaActual.length > 0) ?
                                <div>
                                  <NavLink to={'/visualizar-expediente/' + this.props.match.params.id}>
                                      {this.state.encomenda.EncomendaActual[0].Id_Expediente}
                                  </NavLink>
                                    <b style={{padding: 6}}> // </b>
                                </div>
                                :
                                <div>
                                  <Translate id="languages.breadcrumb.nuevoExpediente"/>
                                    <b style={{padding: 6}}> - </b>
                                </div>
                            }
                            <Translate id="languages.breadcrumb.comunicacionEncargo"/>
                        </BreadcrumbsItem>
                        <Grid item xs={12}>
                            {this.state.activeEncargo && this.state.encomenda
                                ? <ComunicacionEncargo encomenda={this.state.encomenda}
                                                       handleChangeTipoExpediente={(encomenda) => {
                                                           this.handleChangeComunicacionEncargo(encomenda)
                                                       }}/>
                                : !this.state.activeEncargo && this.state.encomenda
                                    ? <Agentes encomenda={this.state.encomenda} isModificacion={this.props.match.params && this.props.match.params.modificado ?  this.props.match.params.modificado : false}
                                               handleAgentes={(encomenda) => {
                                                   this.handleChangeComunicacionEncargo(encomenda)
                                               }}
                                               handleAddComunicacionEncargo={() => {
                                                   this.handleAddComunicacionEncargo()
                                               }}
                                               handleBack={() => {
                                                   this.setState({activeEncargo: true})
                                               }}/>
                                    : ""}
                        </Grid>
                    </Grid>
            }
        </div>
    );
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
  fetchErrorExpediente
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(Encomenda));