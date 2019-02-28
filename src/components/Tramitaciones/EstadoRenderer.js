import React, { Component } from "react";
import { Folder } from '@material-ui/icons';

import './estados.css';
class AccionRenderer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      estadoName: this.props.value,
      idTrabajo: this.props.data.Id_Trabajo,
      color: '000',
      icono: './IconosEstados/default.png',
    }
  }

  getCleanedString(cadena) {
    if (cadena == null)
      return '';
    var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

    for (var i = 0; i < specialChars.length; i++) {
      cadena = cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    }
    cadena = cadena.toLowerCase();
    cadena = cadena.replace(/ /g, "_");
    cadena = cadena.replace(/á/gi, "a");
    cadena = cadena.replace(/é/gi, "e");
    cadena = cadena.replace(/í/gi, "i");
    cadena = cadena.replace(/ó/gi, "o");
    cadena = cadena.replace(/ú/gi, "u");
    cadena = cadena.replace(/ñ/gi, "n");
    return cadena;
  }
  colorea = (nombre) => {
    let nombreLimpio = this.getCleanedString(nombre);
    if (nombreLimpio !== '')
      return (
        <span className={nombreLimpio}>
          <img alt={200} src={require(`./IconosEstados/${nombreLimpio}.jpg`)}></img>
          {nombre}
        </span>);
  }

  renderState

  render() {
    return (<div className='estados'>
      {this.colorea(this.props.value)}
    </div>
    );
  }
};
export default AccionRenderer;
