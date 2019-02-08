import React from 'react'
import { Field, reduxForm } from 'redux-form';


const asyncValidate = async (values, dispatch, props, fieldString) => {
  const errors = {}
  // if (!values.email) {
  //   errors.email = 'Requerido'
  // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //   errors.email = 'Invalid email address'
  // }
  if(!values.password){
      errors.password = "Requerido";
      throw errors;
  } else if( values.password.length < 6 ){
      errors.password = "Mínimo 6 letras";
      throw errors;
  }
  //return new Promise((resolve, reject) => reject(errors))
  //return errors
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
      <input className={touched && error ? 'error' : ''}{...input} placeholder={label} type={type} />
      {touched &&
        ((error &&
          <span className='errorMessage'>
            {error}
          </span>) ||
          (warning &&
            <span>
              {warning}
            </span>))}
    </div>
  </div>


const LoginFormaFinal = props => {
  let { handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
      <div className="inputDiv">
          <Field name="usuario" type="usuario" component={renderField} label="Usuario" />
      </div>
      <div className="inputDiv">
          <Field name="password" type="password" component={renderField} label="Contraseña" />
      </div>
      <div>
        <button className="loginbutton" type="submit" disabled={props.submitting} >
             Entrar
        </button>
      </div>
      <div className="recuperar">
        <a href="">¿Has olvidado tu contraseña?</a>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'loginValidation', // a unique identifier for this form
  asyncValidate,
  asyncBlurFields: [],
})(LoginFormaFinal)





