import React  from 'react';
import HomeContainer from '../containers/HomeContainer';
import { connect } from 'react-redux';
import { withLocalize } from "react-localize-redux";
import './styles.css';
import {Redirect} from "react-router-dom";
import {CircularProgress} from "@material-ui/core";


class MainContainer extends React.Component {
    render() {
        let classeOpacidad = this.props.mostrarModal === true ? 'mainContainer opacidadApp': 'mainContainer';

        return (
            <div>
                { localStorage.getItem('user') ?
                    <div>
                        {
                            this.props.loading === true ?
                                <div className="d-flex justify-content-center">
                                    <CircularProgress />
                                </div>
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
        loading: state.user.loading ? state.user.loading : false,
        mostrarModal: state.status.modalAcciones,
        idiomaFavorito: state.user.DatosConfiguracionesUsuario.Idioma_Predefinido,
    
  });


export default connect(mapStateToProps)(withLocalize(MainContainer));
