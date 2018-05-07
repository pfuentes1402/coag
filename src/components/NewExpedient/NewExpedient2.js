import React, {Component} from 'react';
import { Field, reduxForm , initialize} from "redux-form";
import { Container, Row, Col, UncontrolledAlert } from "reactstrap";
import TablaCatastro from "./CatastroTable";
import { Button } from "reactstrap";
import PropTypes from 'prop-types';
import "./NewExpedient.css";
import { Divider , colors} from "material-ui";
import { connect } from 'react-redux';
import CatastroForm from './CatastroForm';
import { formValueSelector } from 'redux-form'; 

import {validateAddress, postUbicacion, saveAdressTostore, handleSubmit } from '../../actions/expedientes';
import {DriveEta, Input} from 'material-ui-icons'


const validate = values => {
  const errors = {};
  if (!values.codigo) {
    errors.username = "Required";
  } else if (values.codigo.length > 15) {
    errors.codigo = "Tiene que tener menos de 15 caracteres";
  }
  if (!values.estudio) {
    errors.estudio = "Campo requerid0";
  }

  if (values.Refcatastral && (values.Refcatastral.length < 14 || values.Refcatastral.length > 20) ) {
    errors.Refcatastral = "La referencia catastral tiene que tener una longitud de entre 14 y 20 caracteres";
  }  

  return errors;
};

const warn = values => {
  const warnings = {};
  if (values.age < 19) {
    warnings.age = "Hmm, you seem a bit young...";
  }
  
  return warnings;
};

const renderField = ({
  input,
  label,
  type,
  id,
  readOnly,
  meta: { touched, error, warning }
}) => (
  <div>
    <label>{label}</label>
    <div>
      {<input {...input} placeholder={label} type={type} id={id} readOnly={readOnly} />}
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);

const coloralert = (id) =>{
  switch (id){
    case 1:
    return 'danger';
    case 2:
    return 'danger';
    case 3:
    return 'warning';
default:
  return 'primary';
  }
}

let SyncValidationForm = props => {
  const { handleSubmit, pristine,  onBack,submitting, validateAddress, catastro ,mensajes, Refcatastral, catastroSave, saveAdressTostore, adressaved,  } = props;

  return (
    <Container className="margen">
       { mensajes &&
                  <UncontrolledAlert color={coloralert( mensajes[0]['IdTipo'])}>
                        { mensajes[0]['Mensaje']}
                        </UncontrolledAlert>
       }
      <form onSubmit={handleSubmit} className="formularioNuevoExpediente">
        <Row>
          <Col>
            <div className="inputDiv">
              <Field
                name="codigo"
                type="text"
                component={renderField}
                label="Código Expediente"
                readOnly="readonly"
              />
            </div>
            <div className="inputDiv">
              <Field
                name="estudio"
                type="text"
                component={renderField}
                label="Código Estudio"
              />
            </div>
            <div className="inputDiv">
              <Field
                name="titulo"
                type="text"
                component={renderField}
                label="Título Expediente"
              />
            </div>
            <div className="inputDiv">
              <Field
                name="antecedente"
                type="text"
                component={renderField}
                label="Antecedente"
              />
              <p>Introducir el código del expediente en caso que (...)</p>
            </div>
            <div className="inputDiv">
              <label>Observaciones</label>
              <Field
                name="Observaciones"
                component="textarea"
                cols="50"
                rows="5"
                type="text"
                label="Observaciones"
              />
            
            </div>
          </Col>

          <Col>
            <Row>
              <Col sm="9">
                <div className="inputDiv">
                  <Field
                    name="Refcatastral"
                    id="Refcatastral"
                    type="text"
                    htmlFor="inputUbicacion"
                    component={renderField}
                    label="Ubicación"
                    validate={Refcatastral}
                  />
                  <p>La dirección se proporcionará automáticamente</p>
                </div>
              </Col>
              <Col sm="3" className="center-align">
                <Button color="primary"
                //onClick={(e) => validateAddress('9872023VH5797S0001WX')}
                //2906432YK5320N0001QM
                onClick={(e) => validateAddress(document.getElementById("Refcatastral").value)}
                >Validar</Button>
              </Col>
              <Col sm="12" className="center-align">
              <TablaCatastro data={adressaved}/>
                <Button color="danger"               
                onClick={(e) => saveAdressTostore(catastroSave.values)}              
                
                >+</Button>
              </Col>
            </Row>           
            <CatastroForm dataCatastro={catastro[0]}/>          
            <div>
              <div>
              <Button
                  type="button"
                  
                  color="primary"
                  disabled={pristine || submitting}
                  onClick={onBack}
                >
                  Cancelar
                </Button>
                <Button
                outline
                  type="submit"
                 disabled={pristine || submitting}            
                  color="primary"                  
                >
                  Guardar y crear expediente
                </Button>
              </div>
            </div>           
          </Col>        
        </Row>

      </form>
   
     
    </Container>
  );
};

CatastroForm.defaultProps = {
  Refcatastral:'',
};
SyncValidationForm = reduxForm({
    form: 'syncValidation', 
    validate,
    warn,
})(SyncValidationForm)

SyncValidationForm = connect(
    state => ({
        catastro: state.expedientes.addressreduc,
        catastroSave: state.form.CatastroForm,
        adressaved: state.expedientes.adressValidated,
        mensajes:state.expedientes.ExpedientNew.MensajesProcesado, 
        datosNuevoExpediente:state.expedientes.ExpedientNew,
        
       
    }),
    { validateAddress: validateAddress,
      postUbicacion: postUbicacion,
      saveAdressTostore:saveAdressTostore,      
     } 
)(SyncValidationForm)

export default SyncValidationForm

