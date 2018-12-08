import React  from 'react';
import HomeContainer from '../containers/HomeContainer';
import { connect } from 'react-redux';
import {  fetchexpedientesUser } from '../actions/expedientes/';
import { CSSTransitionGroup } from 'react-transition-group'
import  Modalacciones  from '../components/Home/Modalacciones';
import globalTranslations from "./../traducciones/global.json";
import { withLocalize } from "react-localize-redux";
import { renderToStaticMarkup } from "react-dom/server";


import './styles.css';
import {Redirect} from "react-router-dom";
import {fetchCambiaStadoModal, fetchCambiaStatoModalBuscador, fetchMuestraModal} from "../actions/interfaz";
import {goExpedientesUser, goHome, purgarStore} from "../actions/usuarios";


class MainContainer extends React.Component {

    constructor(props) {
        super(props);
      
        let idioma= this.props.idiomaFavorito;
        
        let temp = idioma==='1'? 'es':'gal';
         
        this.props.initialize({
          languages: [
            { name: "Castellano", code: "es" },
            { name: "Gallego", code: "gal" }          
          ],
          translation: globalTranslations,
          options: { renderToStaticMarkup,
            defaultLanguage: temp }
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
                    {
                        this.props.loading === true ?
                            <div>
                                <p>Loading...</p>
                            </div> :
                            <div>
                                <div className={`mainContainer ${claseOpacidad}`}>
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
                    }

                </div>
            )
        }

        return (
            <div>
                { localStorage.getItem('user') ?
                    RenderComponents() :
                    <Redirect push to='/login' />
                }

            </div>
        );
    }
}


const mapStateToProps = state => ({
    loading: state.status.loading ? state.status.loading : '',
    mostrarModal:state.status.modalAcciones,
    idiomaFavorito:state.user.DatosConfiguracionesUsuario.Idioma_Predefinido,
    
  });
const mapDispatchToProps = {
    fetchexpedientesUser: fetchexpedientesUser,
};


export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(MainContainer));
