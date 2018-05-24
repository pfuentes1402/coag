import React, { Component } from 'react';
import { Container, Row, Col,  CardBody, CardTitle} from "reactstrap";
import {Divider, Input, Card, CardHeader} from 'material-ui';
import { Field, reduxForm , initialize} from "redux-form";
import { connect } from 'react-redux';
import  ExpedientContainer from '../../components/MainContent/ExpedientContainer';


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

  let FichaTrabajo = props => {
    const {Promotores, Colegiados } = props;
  
    return (
        <CardBody>
          <Container className="Contenedor">
            <form>
                <Row>
                        
                        <Row>
                            <Col sm={{ size: 5}}>
                                <div className="inputDiv">
                                    <Field
                                        name="Expediente_Codigo_Estudio"
                                        type="text"
                                        component={renderField}
                                        label="Titulo complementario"
                                        readOnly="readonly"
                                    />
                                </div>
                            </Col>
                            <Col sm={{ size: 3, offset: 2}}>
                                <div className="inputDiv">
                                    <Field
                                        name="Fecha_Entrada"
                                        type="text"
                                        component={renderField}
                                        label="Fecha Entrada"
                                        readOnly="readonly"
                                    />
                                </div>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col sm={{ size: 5}}>
                                <div className="inputDiv">
                                    <Field
                                        name="Estado"
                                        type="text"
                                        component={renderField}
                                        label="ESTADO"
                                        readOnly="readonly"
                                    />
                                </div>
                            </Col>
                            <Col sm={{ size: 3, offset: 2}}>
                                <div className="inputDiv">
                                    <Field
                                        name="Fecha_Visado"
                                        type="text"
                                        component={renderField}
                                        label="Fecha Visado"
                                        readOnly="readonly"
                                    />
                                </div>
                            </Col>
                        </Row>      
                   
                </Row>
               
            </form>
            </Container>
            </CardBody>
                                   
        );  
    }

 
    FichaTrabajo = reduxForm({
    form: 'FichaTrabajo', 
 
})(FichaTrabajo)

FichaTrabajo = connect(
    state => ({
        initialValues:state.expedientes.trabajoData ? state.expedientes.trabajoData.Trabajos[0]:"",
        enableReinitialize:true,
           
        //adressaved: state.expedientes.adressValidated,     
       
    }),
    {    
     } 
)(FichaTrabajo)



export default FichaTrabajo;