import React, { Component } from 'react';
import AppHeader from './AppHeader';
import { withStyles } from 'material-ui/styles';
import {Grid} from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import SubHeader from '../components/SubHeader/SubHeader';
import HomeContainer from '../containers/HomeContainer';
import routes from './../routes';
import { connect } from 'react-redux';
import { fetchEstructuraDocumental, fetchexpedientesUser } from '../actions/expedientes/';


class MainContainer extends Component {
    state = {
        title: window.location.pathname
    }
    componentWillMount(){
        this.props.fetchexpedientesUser();       
    }

  
    render() {

        const RenderComponents =() =>{
            return ( <div className="mainContainer">
            <AppHeader/>
            <SubHeader title={this.state.title}/>               
            <HomeContainer/>
            
         </div>)
        }
       
        const loading =() =>{
            return (<div>
                    <p>Loading...</p>
            </div>)
        }




        return (
            <div className="mainContainer">
            {this.props.loading === true ?loading(): RenderComponents()}
            </div>
        );
    }
}


const mapStateToProps = state => ({
    loading:state.status.loading || '',
    
  });


export default connect(mapStateToProps,{fetchexpedientesUser})(MainContainer);
