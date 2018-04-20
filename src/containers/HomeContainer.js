import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MainContent from '../components/MainContent/MainContent';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import { fetchExpedientes } from '../actions/expedientes/';

class HomeContainer extends Component {
    componentDidMount() {
        this.props.fetchExpedientes();
        console.log("entra");
    }
    render() {
        return (
            <div className="homeContainer">
                <MainContent/>
            </div>
        );
    }
}

HomeContainer.propTypes = {
    expedientes: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    fetchExpedientes: PropTypes.func.isRequired,
  };
  
  HomeContainer.defaultProps = {
    loading: false,
  };

const mapStateToProps = state => ({
    expedientes: state.expedientes.data,
    loading: state.expedientes.loading,
  });

const mapDispatchToProps = {
	fetchExpedientes
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);