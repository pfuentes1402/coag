import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NuevoExpediente from '../components/NewExpedient/NewExpedient';
import NuevoExpediente2 from '../components/NewExpedient/NewExpedient2';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import { validateAddress } from '../actions/expedientes/';


class NuevoExpedienteContainer extends Component {

    render() {
        return (
            <div className="nuevoExpedienteContainer">               
             
               <NuevoExpediente2/>                                
            </div>
        );
    }
}
NuevoExpedienteContainer.propTypes = {
    loading: PropTypes.bool,
    validateAddress: PropTypes.func.isRequired,
  };

const mapStateToProps = state => ({
  });

const mapDispatchToProps = {
	validateAddress
};
export default connect(mapStateToProps, mapDispatchToProps)(NuevoExpedienteContainer);