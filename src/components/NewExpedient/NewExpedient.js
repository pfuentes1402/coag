import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TablaCatastro from './CatastroTable';
import { Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import './NewExpedient.css';

// Create component for form
class Form extends Component {

    constructor(props) {
      super(props);
      this.validar = this.validar.bind(this);
      this.updateInputValue = this.updateInputValue.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.state = {
        codigo: '', estudio: '', titulo: '', antecedente: '', observaciones: '',
        inputUbicacion: '',
        catastro: [],
        enlacesMaps: [],
        ubicacion: [],
        emplazamientos: [],
      };
    }
    updateInputValue = (e) => {
      this.setState({inputUbicacion: e.target.value});
    }
    validar(e){
      if(e != ''){
        var api = `http://servicios.coag.es/api/DatosCatastro/${e}`;

        fetch(api)
          .then((response) => {
            return response.json();
          })
          .then((temp) => {

            if(temp.MensajesProcesado.length == 0){

              this.setState({
                ubicacion: temp.Inmuebles[0]
              })
              this.setState({
                catastro: temp.Inmuebles
              });
              this.setState({
                enlacesMaps: temp.Enlaces
              });
            }else{
              alert("Error al validar");
            }
          });
      }
    }
    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
        [name]: value
      });
    }
    handleSubmit(event) {
      var fechaEntrada =  new Date();
      fechaEntrada = fechaEntrada.toISOString();
      
      var request = {
        'Fecha_Entrada' : fechaEntrada,
        'Titulo' : this.state.titulo,
        'Expediente_Codigo_Estudio' : this.state.codigo,
        'Antecedente' : this.state.antecedente,
        'Observaciones' : this.state.observaciones,
        'Emplazamientos' : [
          {'Calle' : this.state.ubicacion.Calle,
          'Numero' : this.state.ubicacion.Numero,
          'Piso' : this.state.ubicacion.Numero,
          'Id_Concello' : this.state.ubicacion.Id_Concello,
          'CodigoPostal' : this.state.ubicacion.Codigo_Postal,
          'Georeferencia' : '',
          }
        ]
      }
    
      fetch('http://servicios.coag.es/api/Expedientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: request
      }).then((response) => {
        
        return response.json();
      });
      event.preventDefault();
    }
    render() {
      return (
        <Container className="margen">
       <form className="formulario" onSubmit={this.handleSubmit} method='' action=''>
       <Row>
         <Col>
         <div className="inputDiv">
          <label>Código Expediente</label>
          <span>123456789</span>
          </div>
          <div className="inputDiv">
          <label>Código Estudio</label>
          <input   
            name='estudio'
            required='true'
            type='text'
            onChange={this.handleInputChange}>
          </input>
          </div>
          <div className="inputDiv">
          <label>Título Expediente</label>
          <input   
            name='titulo'
            required='true'
            type='text'
            onChange={this.handleInputChange}>
          </input>
          </div>
          <div className="inputDiv">
          <label>Antecedente</label>
          <input   
            name='antecedente'
            required='true'
            type='text'
            onChange={this.handleInputChange}>
          </input>
          <p>Introducir el código del expediente en caso que (...)</p>
          </div>
          <div className="inputDiv">
          <label>Observaciones del estudio</label>
          <textarea
            cols="50" rows="5"   
            name='observaciones'
            required='true'
            type='text'
            onChange={this.handleInputChange}>
          </textarea>
          </div>
        </Col>
        <Col>
        <Row>
        <Col sm="9">
        <div className="inputDiv">
          <label>Ubicación</label>
          <input
            placeholder="Ref catastral o coordenadas UTM"
            htmlFor='inputUbicacion'
            required='true'
            type='text'
            value={this.state.inputUbicacion}
            onChange={e => this.updateInputValue(e)}>
          </input>
          <p>La dirección se proporcionará automáticamente</p>
          </div>
          </Col>
          <Col sm="3" className="center-align">
        <Button color="primary" 
        onClick={() => this.validar(this.state.inputUbicacion)}>Validar</Button>
        </Col>
        </Row>
        <TablaCatastro data={this.state.catastro}/>

        <div className="ubicacion">
        <Row>
          <Col sm="4">
            <div className="inputDiv">
              <label>Calle</label>
              <span htmlFor='CalleInput'>
                {this.state.ubicacion.Calle}
              </span>
            </div>
          </Col>
          <Col sm="4">
            <div className="inputDiv">
              <label>Num</label>
              <input
                htmlFor='NumeroInput'
                type='text'
                value={this.state.ubicacion.Numero}
                onChange={this.handleChangeNumero} >
              </input>
            </div>
          </Col>
          <Col sm="4">
            <div className="inputDiv">
            <label>Piso</label>
            <input
              htmlFor='PisoInput'
              type='text'
              value={this.state.ubicacion.Piso}
              onChange={this.handleInputChange} >
            </input>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <div className="inputDiv">
            <label>código postal</label>
            <span htmlFor='cpInput'>{this.state.ubicacion.Codigo_Postal}</span>
            </div>
          </Col>
          <Col sm="4">
            <div className="inputDiv">
            <label>Municipio</label>
            <span htmlFor='MunicipioInput'>{this.state.ubicacion.Id_Municipio}</span>
            </div>
          </Col>
          <Col sm="4">
            <div className="inputDiv">
            <label>Provincia</label>
            <span htmlFor='ProvinciaInput'>{this.state.ubicacion.Id_Provincia}</span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="4">
            <div className="inputDiv">
            <label>Región</label>
            <span htmlFor='PaisInput'>{this.state.ubicacion.Id_Pais}</span>
            </div>
          </Col>
          <Col sm="4">
            <div className="inputDiv">
            <label>País</label>
            <span htmlFor='PaisInput'>{this.state.ubicacion.Id_Pais}</span>
            </div>
          </Col>
          <Col sm="4"></Col>
        </Row>

        </div>

        <div className="inputDiv">
          <label>Alias dirección</label>
          <input   
            htmlFor='estudioInput'
            required='true'
            type='text'>
          </input>

          <p>Introducir un alias para la dirección en caso que (...)</p>
          </div>

          <div>
          <Button
          outline
          color="primary"
          type='submit'
          value='cancelar'
          text='Cancelar'>Cancelar
          </Button>
          {' '}
          <Button
          color="primary"
          type='submit'
          value='Submit'
          text='Guardar y crear expediente'>Guardar y crear expediente

          </Button>
          </div>
          </Col>
          </Row>
        </form>
        </Container>
      )
      }
    }
    
    // Render Form component
    export default Form;