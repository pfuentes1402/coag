import React  from 'react';
import HomeContainer from '../containers/HomeContainer';
import { connect } from 'react-redux';
import {  fetchexpedientesUser } from '../actions/expedientes/';
import { withLocalize } from "react-localize-redux";
import './styles.css';
import {Redirect} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";


class MainContainer extends React.Component {

    constructor(props) {
        super(props);

      }
   
    componentWillMount(){
        this.props.fetchexpedientesUser();
    }

  
    render() {
        let classeOpacidad = this.props.mostrarModal === true ? 'mainContainer opacidadApp': 'mainContainer';

        return (
            <div>
                { localStorage.getItem('user') ?
                    <div>
                        {
                            this.props.loading === true ?
                                <CircularProgress size={24}/>
                                :
                                <div>
                                    <div className={classeOpacidad}>
                                        <HomeContainer/>
                                    </div>

                                </div>
                        }
                    </div>
                    :
                    <Redirect push to='/login' />
                }

            </div>
        );
    }
}


const mapStateToProps = (state) => (
    {
    loading: state.status.loading ? state.status.loading : '',
    mostrarModal: state.status.modalAcciones,
    idiomaFavorito: state.user.DatosConfiguracionesUsuario.Idioma_Predefinido,
    
  });
const mapDispatchToProps = {
    fetchexpedientesUser: fetchexpedientesUser,
};


export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(MainContainer));
