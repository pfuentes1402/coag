import React from 'react'
import { Field, reduxForm } from 'redux-form';



const validate = values => {
  const errors = {}
  // if (!values.email) {
  //   errors.email = 'Requerido'
  // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //   errors.email = 'Invalid email address'
  // }

  if(!values.password){
      errors.password = "Requerido";
  } else if( values.password.length < 6 ){
      errors.password = "Mínimo 6 letras";
  }

  return errors
}


const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) =>
  <div>
    <label>
      {label}
    </label>
    <div>
      <input {...input} placeholder={label} type={type} />
      {touched &&
        ((error &&
          <span>
            {error}
          </span>) ||
          (warning &&
            <span>
              {warning}
            </span>))}
    </div>
  </div>


const LoginFormaFinal = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <form   onSubmit={handleSubmit}>
      <Field name="usuario" type="usuario" component={renderField} label="usuario" />
      <Field name="password" type="password" component={renderField} label="Password" />
      <div>
        <button type="submit" disabled={submitting}>
          Enviar
        </button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Limpiar Valores
        </button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'loginValidation', // a unique identifier for this form
  validate// <--- validation function given to redux-form
})(LoginFormaFinal)