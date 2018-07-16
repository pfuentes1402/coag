import React, { Component } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MainContent from '../components/MainContent/MainContent';

import {getAcciones} from '../api/index';
import "./styles.css";

import { fetchEstructuraDocumental, fetchexpedientesUser, fetchgetAcciones } from '../actions/expedientes/';
import { getTrabajos } from '../actions/usuarios/index';




class HomeContainer extends Component {

    componentWillMount(){
        this.props.fetchexpedientesUser();
        this.props.getTrabajos();       
    }
   

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
    fetchgetAcciones,
    fetchexpedientesUser,
    getTrabajos
    
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);