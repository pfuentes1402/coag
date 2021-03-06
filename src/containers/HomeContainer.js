import React, { Component } from 'react';
import { connect } from 'react-redux';
import MainContent from '../components/MainContent/MainContent';
import "./styles.css";
import { fetchEstructuraDocumental, fetchexpedientesUser, fetchgetAcciones } from '../actions/expedientes/';
import { getTrabajos } from '../actions/usuarios/index';
class HomeContainer extends Component {

  async componentWillMount() {
    await this.props.getTrabajos();
    //await this.props.fetchexpedientesUser();
  }


  render() {
    return (
      <div className="homeContainer">
        <MainContent />
      </div>
    );
  }
}



HomeContainer.defaultProps = {
  loading: false,
};

const mapStateToProps = state => ({
  trabajos: state.expedientes.trabajos,
  loading: state.expedientes.loading,
});

const mapDispatchToProps = {
  fetchEstructuraDocumental,
  fetchgetAcciones,
  fetchexpedientesUser,
  getTrabajos

};
export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);