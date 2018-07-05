import React, { Component } from 'react';
import { Container, Row, Col,  CardBody} from "reactstrap";

import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';


import './styles.css';



const renderField = ({
    input,
    label,
    type,
    id,
    readOnly,
    meta: { touched, error, warning }
  }) => (
    <div>
      <label className="labelsformulario">{label}</label>
      <div>
        {<input {...input} placeholder={label} type={type} id={id} readOnly={readOnly} />}
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );

  let ExpedientType = props => {
    const {adressaved, datosNuevoExpediente } = props;
  
    return (
        <CardBody className="cardBody-ficha">
          <Container className="Contenedor">
            <form>
                <Row>
                    <Col>        
                        <Row>
                            <Col sm={{ size: 5}}>
                                <div className="inputDiv">
                                    <Field
                                        name="TipoExpediente"
                                        type="text"
                                        component={renderField}
                                        label="TIPO DE EXPEDIENTE"
                                        readOnly="readonly"
                                    />
                                </div>
                               
                            </Col>                    
                        </Row>                       
                    </Col>
                </Row>
            </form>
            </Container>
            </CardBody>
                                   
        );  
    }

 
    ExpedientType = reduxForm({
    form: 'ExpedientType', 
 
})(ExpedientType)

ExpedientType = connect(
    state => ({
        //TODO
        //initialValues:state.expedientes.ExpedientNew.Expediente[0] || "",
        datosNuevoExpediente:state.expedientes.ExpedientNew,        
        adressaved: state.expedientes.adressValidated,     
       
    }),
    {    
     } 
)(ExpedientType)



export default ExpedientType;