import React, { Component } from 'react';
import { Field, reduxForm } from "redux-form";
import { Container, Row, Col } from "reactstrap";
import PropTypes from 'prop-types';
import "./NewExpedient.css";
import { Divider } from "material-ui";
import { connect } from 'react-redux';
import {postUbicacion} from '../../actions/expedientes';



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
  let CatastroForm = props => {
    const { handleSubmit, pristine, reset, submitting,catastro  } = props;


  

        return (
            <div className="ubicacion">
            <Row>
              <Col sm="4">
                <div className="inputDiv">
                <Field
                    name="Calle"
                    type="text"
                    htmlFor="calleInput"
                    component={renderField}
                    label="calle"                       
                />                  
                </div>
              </Col>
              <Col sm="4">
                <div className="inputDiv">
                  <Field
                    name="Numero"
                    type="text"
                    htmlFor="NumeroInput"
                    component={renderField}
                    label="Num"
                  />
                </div>
              </Col>
              <Col sm="4">
                <div className="inputDiv">
                  <Field
                    name="Piso"
                    type="text"
                    htmlFor="inputUbicacion"
                    component={renderField}
                    label="Piso"
                  />
                </div>
              </Col>
              <Col sm="4">
                <div className="inputDiv">
                  <Field
                    name="Codigo_Postal"
                    type="text"
                    htmlFor="inputUbicacion"
                    component={renderField}
                    label="código postal"
                  />
                </div>
              </Col>
              <Col sm="4">
                <div className="inputDiv">
                  <Field
                    name="Id_Concello"
                    type="text"
                    htmlFor="inputUbicacion"
                    component={renderField}
                    label="Municipio"
                  />
                </div>
              </Col>
              <Col sm="4">
                <div className="inputDiv">
                  <Field
                    name="Region"
                    type="text"
                    htmlFor="inputUbicacion"
                    component={renderField}
                    label="Región"
                  />
                </div>
              </Col>
              <Col sm="4">
                <div className="inputDiv">
                  <Field
                    name="Pais"
                    type="text"
                    htmlFor="inputUbicacion"
                    component={renderField}
                    label="País"
                  />
                </div>
              </Col>
             
              <Col sm="4">
                <div className="inputDiv">
                  <Field
                    name="Alias"
                    type="text"
                    htmlFor="inputUbicacion"
                    component={renderField}
                    label="Alias dirección"
                  />
                  <p>
                    Introducir un alias para la dirección en caso que (...)
                  </p>
                </div>
              </Col>
              <Col sm="4">
                <div className="inputDiv">
                  <Field
                    name="RefCatastral"
                    type="hidden"                  
                    component={renderField}                  
                  />
                </div>
              </Col>
            </Row>
          </div>
        );
    }

    CatastroForm.defaultProps = {
      catastro:{
        "calle": "",
        "numero": "",
        "cp": "",
        "municipio": ""
      }
    };
    

CatastroForm = reduxForm({
  form: 'CatastroForm', // a unique identifier for this form
  enableReinitialize: true,
})(CatastroForm)


CatastroForm = connect(
  (state) => ({
     // catastro: state.expedientes.addressreduc[0],
     initialValues:state.expedientes.addressreduc[0],
     
     
      // pull initial values from account reducer
  }),{ postUbicacion: postUbicacion }
  // bind account loading action creator
)(CatastroForm)


export default CatastroForm;

