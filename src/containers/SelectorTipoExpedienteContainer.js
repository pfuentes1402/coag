import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SelectorTipoExpediente  from '../components/SelectorTipoExpediente/SelectorTipoExpediente';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';


class SelectorTipoExpedienteContainer extends Component {

    render() {
        return (
            <div className="SelectorTipoContainer">
               <SelectorTipoExpediente/>                                
            </div>
        );
    }
}
SelectorTipoExpedienteContainer.propTypes = {
    loading: PropTypes.bool
  };

const mapStateToProps = state => ({
  });

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectorTipoExpedienteContainer);