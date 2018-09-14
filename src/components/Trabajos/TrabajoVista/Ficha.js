import React, { Component } from 'react'
import FichaTrabajo from '../../Trabajos/FichaTrabajo';
import {Card,  CardHeader, CardText } from 'reactstrap';
import "./styles.css";

class Ficha extends Component {
    constructor() {
        super();
        this.state = {
            noMostrar: false
        };
         this.handdleClick = this.handdleClick.bind(this)
      
      }
      handdleClick(){
          console.log("Hace el click")

          this.setState({ noMostrar: !this.state.noMostrar});
        }

    render() {
      const noMostrar = this.state.noMostrar===false ? 'noMostrar':''; 
    
    return (

        <div>
            <Card>
                <div  onClick={ this.handdleClick }>
                    <CardHeader>
                        <p>Ficha del trabajo</p>
                    </CardHeader>
                </div>
                <CardText tag="div" >
                    <div className={`ficha  ${noMostrar}`}>                
                        <FichaTrabajo/>
                    </div>
                </CardText>

            </Card>


        </div>
    )
  }
}
export default Ficha