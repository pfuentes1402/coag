import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TablaCatastro from './CatastroTable';
import { Button } from 'reactstrap';
import { Container, Row, Col } from 'reactstrap';
import './NewExpedient.css';

   // Create component for label
   class Label extends Component {
    render() {
     if (this.props.hasLabel === 'true') {
      return <label htmlFor={this.props.htmlFor}>{this.props.label}</label>
     }
    }
   }
   
   // Create component for input
   class Input extends Component {
    render() {
     return (
         <div>
       <Label
        hasLabel={this.props.hasLabel}
        htmlFor={this.props.htmlFor}
        label={this.props.label}
       />
       <br/>
        <input
         id={this.props.htmlFor}
         max={this.props.max || null}
         min={this.props.min || null}
         name={this.props.name || null}
         placeholder={this.props.placeholder || null}
         required={this.props.required || null}
         step={this.props.step || null}
         type={this.props.type || 'text'}
        /></div>
     );
    }
   }
   
   // Create component for radio input
   class Radio extends Component {
    render() {
     return (
      <fieldset>
       <label
        htmlFor={this.props.htmlFor}
        label={this.props.label}
       >
        <input
         id={this.props.htmlFor}
         name={this.props.name || null}
         required={this.props.required || null}
         type='radio'
        />
        {this.props.label}
       </label>
      </fieldset>
     );
    }
   }

   
   // Create component for textarea
   class Textarea extends Component {
    render() {
     return (
      <div>
       <Label
        hasLabel={this.props.hasLabel}
        htmlFor={this.props.htmlFor}
        label={this.props.label}
       />
        <br/>
       <textarea
        cols={this.props.cols || null}
        id={this.props.htmlFor}
        name={this.props.name || null}
        required={this.props.required || null}
        rows={this.props.rows || null}
       >
       </textarea>
      </div>
     );
    }
   }

// Create component for form
class Form extends Component {

    constructor(props) {
      super(props);
      this.validar = this.validar.bind(this);
      this.updateInputValue = this.updateInputValue.bind(this);
      this.state = {
        inputUbicacion: '',
        catastro: [],
        enlacesMaps: []
      };
    }
    updateInputValue = (e) => {
      this.setState({inputUbicacion: e.target.value});
    }
    validar(e){
      if(e != ''){
          var api = `http://servicios.coag.es/api/DatosCatastro/${e}`;
          console.log(api);
          fetch(api)
            .then((response) => {
                return response.json();
            })
            .then((temp) => {
              if(temp.MensajesProcesado.length == 0){
                ubicacion: [
                  {calle: temp.MensajesProcesado.Calle, numero: temp.MensajesProcesado.Numero,
                      piso: temp.MensajesProcesado.Planta, cp: temp.MensajesProcesado.Codigo_Postal, municipio: temp.MensajesProcesado.ID_Municipio}
                ]
                this.setState({
                  catastro: temp.Datos_Completos
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

    render() {
      return (
        <Container className="margen">
       <form className="formulario" method='' action=''>
       <Row>
         <Col>
         <div className="inputDiv">
          <label>Código Expediente</label>
          <input   
            htmlFor='codigoInput'
            required='true'
            type='text'>
          </input>
          </div>
          <div className="inputDiv">
          <label>Código Estudio</label>
          <input   
            htmlFor='estudioInput'
            required='true'
            type='text'>
          </input>
          </div>
          <div className="inputDiv">
          <label>Título Expediente</label>
          <input   
            htmlFor='estudioInput'
            required='true'
            type='text'>
          </input>
          </div>
          <div className="inputDiv">
          <label>Antecedente</label>
          <input   
            htmlFor='estudioInput'
            required='true'
            type='text'>
          </input>
          <p>Introducir el código del expediente en caso que (...)</p>
          </div>
          <div className="inputDiv">
          <label>Observaciones del estudio</label>
          <textarea
            cols="50" rows="5"   
            htmlFor='estudioInput'
            required='true'
            type='text'>
          </textarea>
          </div>
        </Col>
        <Col>
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
        <Button color="primary" 
        onClick={() => this.validar(this.state.inputUbicacion)}>Validar</Button>
      
        <TablaCatastro data={this.state.catastro}/>
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
          color="primary"
          type='submit'
          value='cancelar'
          text='Cancelar'>Cancelar
          </Button>
          {' '}
          <Button
          color="primary"
          type='submit'
          value='submit'
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