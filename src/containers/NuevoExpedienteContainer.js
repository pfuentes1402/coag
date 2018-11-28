import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import NuevoExpediente2 from '../components/NewExpedient/NewExpedient2';

import moment from 'moment';
import { validateAddress , postUbicacion } from '../actions/expedientes/';
//import {postNuevoExpediente} from '../api/index';





var datosTosave ={};

let dateNow = moment().format('YYYY-MM-DDTHH:MM:SS')


 function valoresdesde(values, datab){
    datosTosave.Fecha_Entrada=dateNow;
    datosTosave.Titulo=values.titulo;
    datosTosave.Expediente_Codigo_Estudio=values.estudio;
    datosTosave.Antecedente=values.antecedente;
    datosTosave.Observaciones=values.Observaciones;
    datosTosave.Emplazamientos=datab;
    datosTosave.IgnorarObservaciones=1;
    return JSON.stringify(datosTosave);

}


class NuevoExpedienteContainer extends Component {
    
 

    render() {
        return (
            <div className="nuevoExpedienteContainer">
               <NuevoExpediente2 onSubmit={data => {let test = valoresdesde(data, this.props.direcciones)
                
                this.props.postUbicacion(test)} 
                
              }/>                            
                   
                          
                   

                                                           
            </div>
        );
    }
}
NuevoExpedienteContainer.propTypes = {
    loading: PropTypes.bool,
    validateAddress: PropTypes.func.isRequired,
  };

const mapStateToProps = state => ({
    direcciones: state.expedientes.adressValidated,
  });

const mapDispatchToProps = {
    validateAddress,   
    postUbicacion
};
export default  connect(mapStateToProps, mapDispatchToProps)(NuevoExpedienteContainer);