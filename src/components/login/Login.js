import React, {Component} from 'react';
import LoginFormaFinal from './LoginFormaFinal.js';
import { connect } from 'react-redux';
import { fetchLoginExito, errorLogin, fetchUserLogin, fetchLoading } from './../../actions/usuarios/index';
import {withRouter} from 'react-router-dom';


import "./styles.css";


class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            submitting: false
        };
    }


    async userLogin(data) {
        this.props.fetchLoading(true);
        await this.setState({submitting: true});
        try {
            await this.props.fetchUserLogin(data, this.props);
            await this.setState({submitting: false});
            this.props.fetchLoading(false);
        }
        catch (e) {
            await this.setState({submitting: false});
            this.props.fetchLoading(false);
        }

    }
    render(){
        return (
            <div className="centrado login">
                <div className="box-position">
                    <div className="white-box">
                        <img src={require('./images/loginlogo.png')}/>
                        <LoginFormaFinal submitting={this.state.submitting} onSubmit={async (data)=> {await this.userLogin(data, this.props)}}/>
                        <div className="mensaje">{this.props.mensaje}</div>

                    </div>
                </div>
            </div>
        )
    }

}



   const mapStateToProps = state => (
       {
   
            mensaje: state.user.mensaje ?  state.user.mensaje : '',
            user: state.user ?  state.user : '',

    
   });


const mapDispatchToProps = {
    fetchLoginExito,
    errorLogin,
    fetchUserLogin,
    fetchLoading
    
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));


