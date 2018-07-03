import React from 'react';
import LoginFormaFinal from './LoginFormaFinal.js';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchLoginExito, errorLogin, fetchUserLogin } from './../../actions/usuarios/index';

import "./styles.css";

const Login = (props) => {
    // const funcionForma = (datos) => {
    //     console.log(datos);
    //     axios.post('http://servicios.coag.es/api/login',     
    //     {
            
    //             Usuario: datos.usuario,
    //             password: datos.password
            
    //     })
    //     .then(function(response){
    //         console.log(response);
    //         props.fetchLoginExito(response.data);
    //     })
    //     .catch(function(response){
    //         console.log(response);
    //         props.errorLogin(response.data);
    //     })

    // }
    return (
        <div className="centrado">
            <h2>Login</h2>
            {/* {props.mensaje.mensaje} */}
            <LoginFormaFinal onSubmit={ props.fetchUserLogin }/>
        </div>
    )
}


const mapStateToProps = state => ({
  
    // mensaje: state.user.DatosUsuarioValidado!==''? state.user.DatosUsuarioValidado[0].id: '',
    
   });


const mapDispatchToProps = {
    
    fetchLoginExito,
    errorLogin,
    fetchUserLogin,
    
};


export default connect(mapStateToProps, mapDispatchToProps)(Login);


