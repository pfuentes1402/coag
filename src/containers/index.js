import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppFrame from '../../../../appcoag/coag/src/components/AppFrame';
import './styles.css';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';






class HomeContainer extends Component {


    render() {
        return (
            <div className="homeContainer">
               <AppFrame
                    header='Inicio'
                    />                
            </div>
        );
    }
}

export default withRouter(HomeContainer);