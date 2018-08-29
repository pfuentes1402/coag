import React, { Component } from 'react';

import SubHeader from '../components/SubHeader/SubHeader';
import HomeContainer from '../containers/HomeContainer';
import { connect } from 'react-redux';
import {  fetchexpedientesUser } from '../actions/expedientes/';
import { CSSTransitionGroup } from 'react-transition-group'
import  Modalacciones  from '../components/Home/Modalacciones';
import globalTranslations from "./../traducciones/global.json";
import { withLocalize, Translate } from "react-localize-redux";
import { renderToStaticMarkup } from "react-dom/server";
import LanguageToggle from "./../components/test/LanguageToggle";

import './styles.css';


class MainContainer extends React.Component {

    constructor(props) {
        super(props);
    
        this.props.initialize({
          languages: [
            { name: "Castellano", code: "es" },
            { name: "Gallego", code: "gal" }          
          ],
          translation: globalTranslations,
          options: { renderToStaticMarkup }
        });
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


export default connect(mapStateToProps,{fetchexpedientesUser})(withLocalize(MainContainer));
