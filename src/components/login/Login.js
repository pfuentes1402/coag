import React from 'react';
import LoginFormaFinal from './LoginFormaFinal.js';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchLoginExito, errorLogin, fetchUserLogin } from './../../actions/usuarios/index';
import {withRouter} from  'react-router-dom';
import  Mensajes  from './Mensajes';


import "./styles.css";

const Login = (props) => {
   
    return (
        <div className="centrado">
            <h2>Login</h2>
            {/* {props.mensaje.mensaje} */}
            <LoginFormaFinal onSubmit={ props.fetchUserLogin
            }/>
             <h2>{props.mensaje}</h2>         
          
        </div>
    )
}



   const mapStateToProps = state => ({
   
    mensaje: state.user.mensaje || '',
    
   });


const mapDispatchToProps = {
    
    fetchLoginExito,
    errorLogin,
    fetchUserLogin,
    
    
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));


