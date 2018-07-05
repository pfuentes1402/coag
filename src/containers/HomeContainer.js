import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MainContent from '../components/MainContent/MainContent';
import MainContainer from '../components/MainContent/MainContent';

import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import "./styles.css";

import { fetchEstructuraDocumental } from '../actions/expedientes/';
import { fetchDatosUsuario } from '../actions/usuarios/';



class HomeContainer extends Component {

   

    render() {
       
        return (
            <div className="homeContainer">
                <MainContent/>
               
            </div>
        );
    }
}


  
  HomeContainer.defaultProps = {
    loading: false,
  };

const mapStateToProps = state => ({
   // expedientes: state.expedientes.arbolEstructuraDocumentalTrabajo,
    trabajos: state.expedientes.trabajos,
    loading: state.expedientes.loading,
    //expedientes:state.user.data.Expedientes || "",
  });

const mapDispatchToProps = {
    fetchEstructuraDocumental,
    fetchDatosUsuario,
    
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);