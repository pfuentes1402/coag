import React, { Component } from 'react';
import AppHeader from './AppHeader';
import SubHeader from '../components/SubHeader/SubHeader';
import HomeContainer from '../containers/HomeContainer';
import { connect } from 'react-redux';
import {  fetchexpedientesUser } from '../actions/expedientes/';


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
