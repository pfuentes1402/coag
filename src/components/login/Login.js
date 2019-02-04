import React from 'react';
import LoginFormaFinal from './LoginFormaFinal.js';
import { connect } from 'react-redux';
import { fetchLoginExito, errorLogin, fetchUserLogin } from './../../actions/usuarios/index';
import {funcionForma} from '../../api/index';
import { withRouter } from 'react-router-dom';
import "./styles.css";

class Login extends React.Component {
    constructor(props){
        super(props);
    }

    async userLogin(data) {
        await this.props.fetchUserLogin(data, this.props);
    }

    render() {
        return (
            <div className="centrado login">
                <div className="box-position">
                    <div className="white-box">
                        <img src={require('./images/loginlogo.png')} />
                        {/* {props.mensaje.mensaje} */}
                        <LoginFormaFinal onSubmit={(data) => { this.userLogin(data, this.props) }} />
                        <div className="mensaje">{this.props.mensaje}</div>
                    </div>
                </div>
            </div>
        )
    }
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