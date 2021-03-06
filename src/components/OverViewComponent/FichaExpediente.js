import React from 'react';
import { Container, Row, Col, CardBody,} from "reactstrap";
import { Field, reduxForm } from "redux-form";
import { connect } from 'react-redux';
import TablaCatastro from "../NewExpedient/CatastroTable";

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

  let FichaExpediente = props => {
    const {datosNuevoExpediente, ubicaciones } = props;
  
  
    return (
        <CardBody className="cardBody-ficha">
          <Container className="Contenedor">
            <form>
                <Row>
                    <Col>
                        <Row>
                        <Col sm={{ size: 4}}>
                            <div className="inputDiv">
                                <Field
                                    name="Expediente_Codigo_Estudio"
                                    type="text"
                                    component={renderField}
                                    label="Código Estudio"
                                    readOnly="readonly"
                                />
                            </div>
                        </Col>
                        <Col sm={{ size: 4, offset: 2}}>
                            <div className="inputDiv fecha">
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
                            <div className="inputDiv">
                                <Field
                                    name="Antecedente"
                                    type="text"
                                    component={renderField}
                                    label="Antecedente"
                                    readOnly="readonly"
                                />
                            </div>
                            <div className="inputDiv observaciones">
                                <Field
                                    name="Observaciones"
                                    type="text"
                                    component={renderField}
                                    label="Observaciones"
                                    readOnly="readonly"
                                />
                            </div>
                            <div className="inputDiv">
                            <TablaCatastro data={ubicaciones}/>
                            </div>
                            <div className="inputDiv">
                                <Field
                                    name="AliasUbicacion"
                                    type="text"
                                    component={renderField}
                                    label="Alias Ubicación"
                                    readOnly="readonly"
                                />
                            </div>
                    </Col>
                </Row>
            </form>
            </Container>
            </CardBody>
                                   
        );  
    }

 
FichaExpediente = reduxForm({
    form: 'FichaExpediente',
    enableReinitialize: true,
 
})(FichaExpediente)

FichaExpediente = connect(
    state => (
        {
        initialValues: state.expedientes.expedienteData.Expediente ? state.expedientes.expedienteData.Expediente[0] : [],
        datosNuevoExpediente: state.expedientes.expedienteData.Expediente ? state.expedientes.expedienteData : '',
        adressaved: state.expedientes.adressValidated,
        ubicaciones: state.expedientes.expedienteData.Emplazamientos ? state.expedientes.expedienteData.Emplazamientos : '',
       
    }),
    {    
     } 
)(FichaExpediente)



export default FichaExpediente;