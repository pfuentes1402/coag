import React, { Component } from 'react';
import AppHeader from './AppHeader';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import SubHeader from '../components/SubHeader/SubHeader';


class MainContainer extends Component {

    render() {
        return (
            <div className="mainContainer">
               <AppHeader/>
               <SubHeader/>
            </div>
        );
    }
}

export default MainContainer;