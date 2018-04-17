import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import MainContent from '../components/MainContent/MainContent';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';



class HomeContainer extends Component {

    render() {
        return (
            <div className="homeContainer">
                <MainContent/>
            </div>
        );
    }
}

export default withRouter(HomeContainer);