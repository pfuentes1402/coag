import React, { Component } from 'react'
import FichaTrabajo from '../../Trabajos/FichaTrabajo';
import {Card,  CardHeader, CardText, ListGroup} from 'reactstrap';
import ExpedientContainer from '../../MainContent/ExpedientContainer';
import TrabajosContainer from '../../Trabajos/TrabajosContainer';
import { connect } from 'react-redux';
import TablaArchivos from './TablaArchivos' ;
import "./styles.css";

class Archivos extends Component {
    constructor() {
        super();
        this.state = {
            noMostrar: true
        };
         this.handdleClick = this.handdleClick.bind(this)
      
      }
      handdleClick(){
        //   console.log("Hace el click")
        //   this.setState({ noMostrar: !this.state.noMostrar});
        }

    render() {
      const noMostrar = this.state.noMostrar===false ? 'noMostrar':''; 
    
    return (

        <div>
            <Card>
                <div onClick={this.handdleClick}>
                    <CardHeader>
                        <p>Archivos de Trabajo</p>
                    </CardHeader>
                </div>

                <CardText tag="div" >
                    <div className={`ficha  ${noMostrar}`}>
                        <div className="textoArquitectos">
                        
                       
                        <ListGroup>
                        <TablaArchivos/>
                        </ListGroup>
                           
                        </div>             
                    </div>
                </CardText>

            </Card>


        </div>
    )
  }
}
const mapStateToProps = state => ({
   
    
   
  });


export default connect(mapStateToProps,{})(Archivos);
