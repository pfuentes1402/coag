import React, { PureComponent } from 'react'
import { setSelectedExpedienteTo } from './../../actions/expedientes'
import { connect } from 'react-redux';

 class TrabajoElemto extends PureComponent {

    constructor() {
        super();
        this.state = {
            noMostrar: false
        };
         this.handdleClick = this.handdleClick.bind(this)      
      }

      handdleClick(data){
          console.log("Hace el click")
          this.setState({ noMostrar: !this.state.noMostrar});
          
          this.props.setSelectedExpedienteTo(data);
        }

  render() {    

    const noMostrar = this.state.noMostrar===false ? 'noMostrar':''; 
    

    return (
      <div>
        <div  onClick={ ()=>(this.handdleClick(this.props.data)) }>
        <div>
            <span>{this.props.data.Titulo}</span> 
        </div>
            <div className={`ficha  ${noMostrar}`}>                
            {this.props.data.Id_Trabajo}
            {this.props.data.Id_Expediente}
            </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  
});


export default connect(mapStateToProps,{ setSelectedExpedienteTo })(TrabajoElemto);