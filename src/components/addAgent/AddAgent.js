import React, { Component } from 'react'
import {fetchBuscador } from '../../actions/expedientes/index'
import { connect } from 'react-redux';
import TablaBusquedaArquitectos  from '../Busquedas/TablaBusquedaArquitectos';
import DatosAgente from './DatosAgente'

import "./styles.css";



class AddAgent extends Component {


  handdlebuscador = (e) => {
             
    this.props.fetchBuscador(e.target.value,'promotores');
}



  render() {

    const ocultaradd= this.props.mostrarContenido ===false ? 'addContainer':''; 
  
    return (
      <div className={`containerAdd ${ocultaradd}`} >
        <div className="contenedorSelectadd">
            <div classname="column-item">
              <label>            
                <input type="text" name="name" onChange={(e)=>{this.handdlebuscador(e)}}/>
              </label>
            </div>
            <div className="column-item"></div>
              <select>
                <option value="Nombre">Nombre</option>
                <option value="Codigo">Codigo</option>              
            </select>
            </div>
            <button>Cancelar</button>
            <button>Buscar</button>

           
           <TablaBusquedaArquitectos data={this.props.datosAgentes}></TablaBusquedaArquitectos>
           <DatosAgente/>
  
        </div>          
      
    )
  }
}


const mapStateToProps = state => ({
      datosAgentes:state.trabajos.promotoresTrabajoSelec ||"",
});





export default connect(mapStateToProps,{ fetchBuscador })(AddAgent);
