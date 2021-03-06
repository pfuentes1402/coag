import React, { Component } from "react";
import { Collapse } from "reactstrap";
import { connect } from "react-redux";
import "./styles.css";

import ContenedorExpediente from "../ComponenteLareral/ContenedorExpediente";
import {
  setSelectedExpedienteTo,
  fetchEstructuraDocumental
} from "../../actions/expedientes";

class Expandible extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: true };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const handleClickLateral = trabajo => {
      
     
      let nodo = this.props.nodo;
      if (nodo !== trabajo.Id_Trabajo) { 
        this.props.setSelectedExpedienteTo(
          trabajo.Id_Expediente,
          trabajo.Id_Trabajo
        );

        this.props.fetchEstructuraDocumental(
          trabajo.Id_Expediente,
          trabajo.Id_Trabajo
        );
      }
    };

    const strToComponentTrabajo = trabajos =>
      trabajos.map(dato => (
        <ContenedorExpediente
          key={dato.Id_Expediente + dato.Id_Trabajo}
          titulo={dato.Titulo}
          OnhandleClickLateral={() => handleClickLateral(dato)}
        />
      ));

    return (
      <div>
        <div color="primary" className="bloque" onClick={this.toggle}>
          {this.props.expedienteActualid}-
          {this.props.expedienteActualtitulo}
        </div>
        <Collapse isOpen={this.state.collapse}>
          <div>
            <div>{strToComponentTrabajo(this.props.trabajos)}</div>
          </div>
        </Collapse>
      </div>
    );
  }
}

Expandible.defaultProps = {
  trabajos: []
};

const mapStateToProps = state => ({
  dataArbol: state.expedientes.arbolEstructuraTrabajoRefactor
    ? state.expedientes.arbolEstructuraTrabajoRefactor[0]
    : "",
  trabajos: state.expedientes.expedienteData.Trabajos || [{}],
  nodo: state.expedientes.arbolEstructuraTrabajoRefactor[0].id_documento || "",
  expedienteActualtitulo:state.seleccionado.expedienteActualtitulo || "",
  expedienteActualid:state.seleccionado.expedienteActualid || "",

});

export default connect(
  mapStateToProps,
  { setSelectedExpedienteTo, fetchEstructuraDocumental }
)(Expandible);
