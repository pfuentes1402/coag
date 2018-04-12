import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import AppFrame from '../components/AppFrame';
import './styles.css';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';






class HomeContainer extends Component {

   /* componentWillMount(){
        fetch('http://servicios.coag.es/api/EstructuraDocumental/702181/2')
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((temp) => {
                var temporal = temp;
                console.log(temporal);
            });
    }*/


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