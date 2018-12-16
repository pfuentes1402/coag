import React, { Component } from 'react'
import { connect } from 'react-redux';
import {Card,  CardHeader, CardText } from 'reactstrap';



class Profile extends Component {
    render() {
        return (
            <div>
                <Card>
                    <div onClick={this.handdleClick}>
                        <CardHeader>
                            <p>Datos Usuario</p>
                        </CardHeader>
                    </div>
                    <CardText tag="div" >
                        <div>
                            <div>                            
                                {this.props.datosUsuarios.Id}
                            </div>
                            <div>
                                {this.props.datosUsuarios.Usuario}
                            </div>
                            <div>
                                {this.props.datosUsuarios.Mail}
                            </div>
                            <div>
                                {this.props.datosUsuarios.Fecha_Ultima_Conexion}
                            </div>
                            <label>
                            Idioma
                            <select  onChange={()=>{}} >
                                    <option  value="1">Castellano</option>
                                    <option  value="2">Gallego</option>
                                   </select>
                            </label>

                        </div>
                    </CardText>

                </Card>


            </div>

        )
    }
}

const mapStateToProps = state => ({
datosUsuarios:state.user.DatosUsuarioValidado,
idiomaConf:state.user.DatosConfiguracionesUsuario.Idioma_Predefinido,
});


export default connect(mapStateToProps,{ })(Profile);
