import React from 'react';
import LoginFormaFinal from './LoginFormaFinal.js';
import { connect } from 'react-redux';
import { fetchLoginExito, errorLogin, fetchUserLogin } from './../../actions/usuarios/index';
import { withRouter } from 'react-router-dom';
import "./styles.css";


const Login = (props) => {
    const userLogin = (data) => {
        props.fetchUserLogin(data, props);
    }

    return (
        <div className="centrado login">
            <div className="box-position">
                <div className="white-box">
                    <img src={require('./images/loginlogo.png')} />
                    {/* {props.mensaje.mensaje} */}
                    <LoginFormaFinal onSubmit={(data) => { userLogin(data, props) }} />
                    <div className="mensaje">{props.mensaje}</div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => (
    {
        mensaje: state.user.mensaje ? state.user.mensaje : '',
        user: state.user ? state.user : '',
    });

const mapDispatchToProps = {
    fetchLoginExito,
    errorLogin,
    fetchUserLogin,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));