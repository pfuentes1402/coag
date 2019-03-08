import React, { Component } from 'react';
import LoginFormaFinal from './LoginFormaFinal.js';
import { connect } from 'react-redux';
import {
    fetchLoginExito, errorLogin, fetchUserLogin,
    fetchLoading, dispatchErrorLogin
} from './../../actions/usuarios/index';
import { withRouter } from 'react-router-dom';
import { Translate } from "react-localize-redux";
import "./styles.css";
import { Typography } from '@material-ui/core';


class Login extends Component {
    constructor(props) {
        console.log("props", props);
        super(props);
        this.state = {
            submitting: false
        };
    }

    componentDidMount() {
        this.props.dispatchErrorLogin(null);
    }

    async userLogin(data) {
        this.props.fetchLoading(true);
        await this.setState({ submitting: true });
        try {
            await this.props.fetchUserLogin(data, this.props);
            await this.setState({ submitting: false });
            this.props.fetchLoading(false);
        }
        catch (e) {
            await this.setState({ submitting: false });
            this.props.fetchLoading(false);
        }

    }
    render() {
        return (
            <div className="centrado login">
                <div className="box-position">
                    <div className="white-box">
                        <img alt={200} src={require('./images/loginlogo.png')} />
                        <LoginFormaFinal submitting={this.state.submitting} onSubmit={async (data) => { await this.userLogin(data) }} />
                        <div className="error">
                            {this.props.mensaje
                                ? <Typography variant="caption" gutterBottom color="error" className="text-left">
                                    <Translate id="languages.messages.loginFailed" />
                                </Typography>
                                : ""}
                        </div>
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
    fetchLoading,
    dispatchErrorLogin
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));


