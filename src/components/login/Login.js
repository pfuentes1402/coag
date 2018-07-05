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
        <div className="centrado login">
            <div className="box-position">
            <div className="white-box">
                <img src={require('./images/loginlogo.png')}/>
                {/* {props.mensaje.mensaje} */}
                <LoginFormaFinal onSubmit={ props.fetchUserLogin
                }/>
                <div className="mensaje">{props.mensaje}</div>
            </div>    
          </div>
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
    loginAndRedirect,
    
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));


