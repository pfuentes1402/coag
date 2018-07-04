import React from 'react';
import LoginFormaFinal from './LoginFormaFinal.js';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchLoginExito, errorLogin, fetchUserLogin, loginAndRedirect } from './../../actions/usuarios/index';
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
           <Mensajes/>
        </div>
    )
}



   const mapStateToProps = state => ({
   
   
    
   });


const mapDispatchToProps = {
    
    fetchLoginExito,
    errorLogin,
    fetchUserLogin,
    loginAndRedirect,
    
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));


