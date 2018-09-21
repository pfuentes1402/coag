import React, { Component } from 'react'
import FichaTrabajo from '../../Trabajos/FichaTrabajo';
import {Card,  CardHeader, CardText } from 'reactstrap';
import ExpedientContainer from '../../MainContent/ExpedientContainer';
import TrabajosContainer from '../../Trabajos/TrabajosContainer';
import { connect } from 'react-redux';
import "./styles.css";

class Agentes extends Component {
    constructor() {
        super();
        this.state = {
            noMostrar: false
        };
         this.handdleClick = this.handdleClick.bind(this)
      
      }
      handdleClick(){
         

          this.setState({ noMostrar: !this.state.noMostrar});
        }

    render() {
      const noMostrar = this.state.noMostrar===false ? 'noMostrar':''; 
    
    return (

        <div>
            <Card>
                <div onClick={this.handdleClick}>
                    <CardHeader>
                        <p>Arquitectos Promotores y otros agentes</p>
                    </CardHeader>
                </div>

                <CardText tag="div" >
                    <div className={`ficha  ${noMostrar}`}>
                        <div className="textoArquitectos">
                            <p>Arquitectos y promotores se deben editar desde la ficha del expediente,
                              ya que implican una comunicacion de encargo.
                        </p>
                        </div>
                        <div className="trabajos">
                            <TrabajosContainer titulo='Arquitectos' datosAgentes={this.props.Colegiados} />
                        </div>
                        <CardText tag="div" className="trabajos"><ExpedientContainer titulo='Promotores' datosAgentes={this.props.Promotores} /></CardText>
                        <CardText tag="div" className="trabajos"> <ExpedientContainer renderB={true} titulo='Otros agentes' datosAgentes={this.props.Colegiados} /></CardText>

                    </div>
                </CardText>

            </Card>


        </div>
    )
  }
}
const mapStateToProps = state => ({
   
    Colegiados:state.expedientes.trabajoData ?state.expedientes.trabajoData.Colegiados:"",
    Promotores:state.expedientes.trabajoData ?state.expedientes.trabajoData.Promotores:"",   
    
   
  });


export default connect(mapStateToProps,{})(Agentes);
