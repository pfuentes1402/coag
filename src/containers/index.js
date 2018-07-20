import React, { Component } from 'react';
import AppHeader from './AppHeader';
import SubHeader from '../components/SubHeader/SubHeader';
import HomeContainer from '../containers/HomeContainer';
import { connect } from 'react-redux';
import {  fetchexpedientesUser } from '../actions/expedientes/';
import { CSSTransitionGroup } from 'react-transition-group'
import  Modalacciones  from '../components/Home/Modalacciones';

import './styles.css';


class MainContainer extends Component {
    state = {
        title: window.location.pathname
    }
    componentWillMount(){
        this.props.fetchexpedientesUser();       
    }

  
    render() {
        const claseOpacidad= this.props.mostrarModal ===true ? 'opacidadApp':'';

        const renderModal =() =>{      
            return (<Modalacciones/>)
        }

        const RenderComponents =() =>{
            return (
            <div>
                
                <div className={`mainContainer ${claseOpacidad}`} >
                    <AppHeader/>
                    <SubHeader title={this.state.title}/>               
                    <HomeContainer/>            
                </div>
                    <div>
                        <CSSTransitionGroup
                                        transitionName="acciones"
                                        transitionEnterTimeout={3000}
                                        transitionLeaveTimeout={3000}>
                                        {this.props.mostrarModal ===true?renderModal():''}
                        </CSSTransitionGroup>     
                    </div>
            </div>
        )
        }
       
        const loading =() =>{
            return (<div>
                    <p>Loading...</p>
            </div>)
        }


        return (
            <div>
            {this.props.loading === true ?loading(): RenderComponents()}
            </div>
        );
    }
}


const mapStateToProps = state => ({
    loading:state.status.loading || '',
    mostrarModal:state.status.modalAcciones,
    
  });


export default connect(mapStateToProps,{fetchexpedientesUser})(MainContainer);
