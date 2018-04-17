import React, { Component } from 'react';
import AppHeader from './AppHeader';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';



class MainContainer extends Component {

    render() {
        return (
            <div className="mainContainer">
               <AppHeader/>
               
            </div>
        );
    }
}

export default MainContainer;