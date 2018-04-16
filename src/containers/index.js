import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppFrame from '../components/AppFrame';
import './styles.css';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';



class MainContainer extends Component {

    render() {
        return (
            <div className="mainContainer">
               <AppFrame
                    header='Inicio'
                    />                
            </div>
        );
    }
}

export default withRouter(MainContainer);