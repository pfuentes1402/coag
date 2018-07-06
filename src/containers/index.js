import React, { Component } from 'react';
import AppHeader from './AppHeader';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import SubHeader from '../components/SubHeader/SubHeader';
import HomeContainer from '../containers/HomeContainer';
import routes from './../routes';
import { fetchEstructuraDocumental, fetchexpedientesUser } from '../actions/expedientes/';


class MainContainer extends Component {
    state = {
        title: window.location.pathname
    }

  
    render() {
        return (
            <div className="mainContainer">
               <AppHeader/>
               <SubHeader title={this.state.title}/>               
               <HomeContainer/>
               
            </div>
        );
    }
}

export default MainContainer;