import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Vault as VaultBase, i18n } from "dhx-vault";
import "dhx-vault/codebase/vault.css";

class Vault extends Component {
  componentDidMount() {
    var es = {
      dragAndDrop: "Arrastrar",
      or: "o",
      browse: "Seleccionar",
      filesOrFoldersHere: "ficheros y carpetas aquí",
      cancel: "Cancelar",
      clearAll: "Limpiar todo",
      clear: "Limpiar",
      add: "Addicionar",
      upload: "Subir",
      download: "Descargar",
      error: "error",
      byte: "B",
      kilobyte: "KB",
      megabyte: "MB",
      gigabyte: "GB"
    };
    this.vault = new VaultBase(this.el, {
      data: this.props.data,
      mode: this.props.mode,
      uploader: {
        autosend: this.props.autosend,
        target: this.props.target
      },
      toolbar: this.props.toolbar,
    });
    
    console.log("vault", this.vault);
    console.log("i18n", i18n);
    i18n.setLocale("vault",es);
  }

  componentWillUnmount() {
    this.vault.destructor();
  }

  render() {
    return (
      <div ref={el => this.el = el} className="widget-box"></div>
    );
  }
}
Vault.propTypes = {
  data: PropTypes.array,
  mode: PropTypes.string,
  autosend: PropTypes.bool,
  target: PropTypes.any,
  toolbar: PropTypes.bool
};


export default Vault;
