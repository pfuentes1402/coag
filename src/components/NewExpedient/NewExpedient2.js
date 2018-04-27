import React, {Component} from 'react';
import { Field, reduxForm } from "redux-form";
import { Container, Row, Col } from "reactstrap";
import TablaCatastro from "./CatastroTable";
import { Button } from "reactstrap";
import PropTypes from 'prop-types';
import "./NewExpedient.css";
import { Divider } from "material-ui";
import { connect } from 'react-redux';

import {validateAddress} from '../../actions/expedientes';


const validate = values => {
  const errors = {};
  if (!values.codigo) {
    errors.username = "Required";
  } else if (values.codigo.length > 15) {
    errors.codigo = "Tiene que tener menos de 15 caracteres";
  }
  if (!values.estudio) {
    errors.estudio = "Campo requerido";
  }
  if (!values.titulo) {
    errors.titulo = "Required";
  } else if (this.values.titulo.length > 150) {
    errors.codigo = "Tiene que tener menos de 150 caracteres";
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

/*class SyncValidationForm extends Component{
  constructor(props){
    super(props);
    this.validar = this.validar.bind(this);
}
componentWillMount(){
//9872023VH5797S0001WX
  console.log("validar 1");
  //this.props.validateAddress('9872023VH5797S0001WX');

}
  validar(e){

    e.preventDefault();
    console.log('validar desde Boton');
      this.props.validateAddress('9872023VH5797S0001WX');
  }

    render(){
    return(
      <Container className="margen">
      <form onSubmit={this.props.handleSubmit}>
        <Row>
          <Col>
            <div className="inputDiv">
              <Field
                name="codigo"
                type="text"
                component={renderField}
                label="Código Expediente"
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
                readOnly="readOnly"
                value="Hola que hacce"
              />
            </div>
          </Col>

          <Col>
            <Row>
              <Col sm="9">
                <div className="inputDiv">
                  <Field
                    name="Refcatastral"
                    type="text"
                    htmlFor="inputUbicacion"
                    component={renderField}
                    label="Ubicación"
                  />
                  <p>La dirección se proporcionará automáticamente</p>
                </div>
              </Col>
              <Col sm="3" className="center-align">
                <Button color="primary"
                onClick={(e) => this.validar(e)}
                >Validar</Button>
              </Col>
            </Row>
            <TablaCatastro data={this.props.catastro}/>

            <div className="ubicacion">
              <Row>
                <Col sm="4">
                  <div className="inputDiv">
                    <Field
                      name="calle"
                      component={renderField}
                      type="text"
                      label="Calle"

                    />
                  </div>
                </Col>
                <Col sm="4">
                  <div className="inputDiv">
                    <Field
                      name="numero"
                      id="numero"
                      type="text"
                      htmlFor="NumeroInput"
                      component={renderField}
                      label="Numero"
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
                      name="cp"
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
                      name="Municipio"
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
              </Row>
            </div>
            <div>
              <div>
              <Button
                  type="submit"
                  value="submit"
                  color="primary"
                  disabled={this.props.pristine || this.props.submitting}
                  onClick={this.props.reset}
                >
                  Cancelar
                </Button>
                <Button
                outline
                  type="submit"
                  disabled={this.props.submitting}
                  
                  color="primary"
                  value="cancelar"
                >
                  Guardar y crear expediente
                </Button>
                
              </div>
            </div>
          </Col>
        </Row>
      </form>
    </Container>
    )
  }
}*/
let SyncValidationForm = props => {
  const { handleSubmit, pristine, reset, submitting, validateAddress, catastro  } = props;

  return (
    <Container className="margen">
      <form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <div className="inputDiv">
              <Field
                name="codigo"
                type="text"
                component={renderField}
                label="Código Expediente"
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
                    type="text"
                    htmlFor="inputUbicacion"
                    component={renderField}
                    label="Ubicación"
                  />
                  <p>La dirección se proporcionará automáticamente</p>
                </div>
              </Col>
              <Col sm="3" className="center-align">
                <Button color="primary"
                onClick={() => validateAddress('9872023VH5797S0001WX')}
                >Validar</Button>
              </Col>
            </Row>
            <TablaCatastro data={catastro}/>

            <div className="ubicacion">
              <Row>
                <Col sm="4">
                  <div className="inputDiv">
                    <Field
                      name="Calle"
                      type="text"
                      htmlFor="inputUbicacion"
                      component={renderField}
                      label="Calle"
                    />
                  </div>
                </Col>
                <Col sm="4">
                  <div className="inputDiv">
                    <Field
                      name="Num"
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
                      name="CP"
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
                      name="Municipio"
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
              </Row>
            </div>
            <div>
              <div>
              <Button
                  type="submit"
                  value="submit"
                  color="primary"
                  disabled={pristine || submitting}
                  onClick={reset}
                >
                  Cancelar
                </Button>
                <Button
                outline
                  type="submit"
                  disabled={submitting}

                  color="primary"
                  value="cancelar"
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

// const mapStateToProps = (state) => ({
//
//   catastro: state.expedientes.addressreduc,
//   initialValues: state.expedientes.addressreduc,
// });
// SyncValidationForm.defaultProps = {
//     catastro: [],
// };
// SyncValidationForm = connect(
//
//   mapStateToProps,
//   {validateAddress}
// )(SyncValidationForm);
//
// export default reduxForm({
//   form: "syncValidation", // a unique identifier for this form
//      enableReinitialize:true,
//     // keepDirtyOnReinitialize:true,
//     validate, // <--- validation function given to redux-form
//   warn, // <--- warning function given to redux-form
// })(SyncValidationForm);

SyncValidationForm = reduxForm({
    form: 'syncValidation', // a unique identifier for this form
    validate,
    warn,
})(SyncValidationForm)

SyncValidationForm = connect(
    state => ({
        catastro: state.expedientes.addressreduc,
        initialValues: state.expedientes.addressreduc[0], // pull initial values from account reducer
    }),
    { validateAddress: validateAddress } // bind account loading action creator
)(SyncValidationForm)


export default SyncValidationForm

