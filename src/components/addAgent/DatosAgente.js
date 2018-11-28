import React from 'react';
import { Field, reduxForm } from "redux-form";
import {  Row, Col } from "reactstrap";

import "./styles.css";

import { connect } from 'react-redux';




const renderField = ({
    input,
    label,
    type,
    //readOnly,
    meta: { touched, error, warning }
  }) => (
    <div>
      <label>{label}</label>
      <div>
        {<input {...input} placeholder={label} type={type} /*readOnly={readOnly}*/ />}
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
  let DatosAgente = props => {
    const { handleSubmit, pristine, reset, submitting,catastro  } = props;


  

        return (
          <div className="paddingHelp">
            <p>Datos Generales</p>
                <div className="Ficha Agente">
                <Row>
                  <Col sm="6">
                    <div className="inputDiv">
                    <Field
                        name="Nif"
                        type="text"
                        htmlFor="NifInput"
                        component={renderField}
                        label="NIF"                       
                    />                  
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="inputDiv">
                      <Field
                        name="Nombre"
                        type="text"
                        htmlFor="NombreInput"
                        component={renderField}
                        label="NOMBRE"
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="inputDiv">
                      <Field
                        name="Apellido1"
                        type="text"
                        htmlFor="inputApellido1"
                        component={renderField}
                        label="SEGUNDO APELLIDO"
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="inputDiv">
                      <Field
                        name="Apellido2"
                        type="text"
                        htmlFor="inputApellido2"
                        component={renderField}
                        label="SEGUNDO APELLIDO"
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="inputDiv">
                      <Field
                        name="Contacto"
                        type="text"
                        htmlFor="inputContacto"
                        component={renderField}
                        label="SEGUNDO APELLIDO"
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="inputDiv">
                      <Field
                        name="Apellido2"
                        type="text"
                        htmlFor="inputApellido2"
                        component={renderField}
                        label="SEGUNDO APELLIDO"
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="inputDiv">
                      <Field
                        name="Apellido2"
                        type="text"
                        htmlFor="inputApellido2"
                        component={renderField}
                        label="SEGUNDO APELLIDO"
                      />
                    </div>
                  </Col>
                  
                </Row>
              </div>
          </div>
        );
    }

    DatosAgente.defaultProps = {
      
    };
    

DatosAgente = reduxForm({
  form: 'DatosAgente', 
  enableReinitialize: true,
})(DatosAgente)


DatosAgente = connect(
  (state) => ({
    initialValues: state.expedientes.expedienteData.Expediente ? state.expedientes.expedienteData.Expediente[0] : [],
  }),{  }
 
)(DatosAgente)


export default DatosAgente;

