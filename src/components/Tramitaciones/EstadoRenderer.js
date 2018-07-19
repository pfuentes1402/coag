import React, {Component} from "react";
import PropTypes from 'prop-types';

class AccionRenderer extends Component {
    constructor(props) {
        super(props);
        this.state = {
          estadoName: this.props.value,
          idTrabajo: this.props.data.Id_Trabajo,
          color: '000',
          icono: './IconosEstados/default.png',
        }
        this.invokeParentMethod = this.invokeParentMethod.bind(this);
    }

    invokeParentMethod() {
        alert("Id del trabajo: "+this.state.idTrabajo);
    }


    colorea = (nombre) => {
      console.log(nombre);
      switch(nombre){
      case 'Preentrega':
        return( 
        <span style={{color:'#b4c2c9'}}>
          <img style={{width:'15px', margin:'0 5px 0 0'}} src={require('./IconosEstados/file.jpg')}></img>{nombre}
        </span>);
        break;
      case 'Entregado':
        return( 
        <span style={{color:'#7f7f7f'}}>
          <img style={{width:'15px', margin:'0 5px 0 0'}} src={require('./IconosEstados/file.jpg')}></img>{nombre}
        </span>);
        break;
      case 'En trámite':
        return(
        <span style={{color:'#7f7f7f'}}>
          <img style={{width:'15px', margin:'0 5px 0 0'}} src={require('./IconosEstados/file.jpg')}></img>{nombre}
        </span>);
        break;
      case 'Pendiente':
        return(
        <span style={{color:'#7f7f7f'}}>
          <img style={{width:'15px', margin:'0 5px 0 0'}} src={require('./IconosEstados/file.jpg')}></img>{nombre}
        </span>);
        break;
      case 'Retenido':
        return(
        <span style={{color:'#fe6c3e'}}>
          <img style={{width:'15px', margin:'0 5px 0 0'}} src={require('./IconosEstados/file.jpg')}/>{nombre}
        </span>);
        break;
      case 'Tramitado':
        return(
        <span style={{color:'#75c178'}}>
          <img style={{width:'15px', margin:'0 5px 0 0'}} src={require('./IconosEstados/file.jpg')}/>{nombre}
        </span>);
        break;
      case 'Pendiente de retirar':
      return(
        <span style={{color:'#7f7f7f'}}>
          <img style={{width:'15px', margin:'0 5px 0 0'}} src={require('./IconosEstados/file.jpg')}/>{nombre}
        </span>);
        break;
    }
    return '';
  }

    render() {
        return (<div>
              {this.colorea(this.props.value)}
              </div>
        );
    }
};
const propTypes = {
  data: PropTypes.array,
}

export default AccionRenderer;
