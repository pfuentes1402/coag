import React, { Component } from 'react';
import AppHeader from './AppHeader';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import SubHeader from '../components/SubHeader/SubHeader';


class MainContainer extends Component {
    state = {
        title: window.location.pathname
    }
    render() {
        return (
            <div className="mainContainer">
               <AppHeader/>
               <SubHeader title={this.state.title}/>
            </div>
        );
    }
}

export default MainContainer;