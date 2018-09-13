import React, { Component } from 'react';
import { Card,  CardHeader, CardText , Button} from 'reactstrap';
import AgentsTable from './ExpedientType/AgentsTable';
import { connect } from 'react-redux';
import AddAgent from '../addAgent/AddAgent';


class ExpedientContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            muestraAdd:false,
                }
    this.handlerClickAddAgent = this.handlerClickAddAgent.bind(this);
    }

    handlerClickAddAgent(){      
        this.setState({
            muestraAdd:!this.state.muestraAdd
          });          
    }
   

    render() {
      
        const renderButton =() =>{      
            return (<Button onClick={this.handlerClickAddAgent}>+</Button>   )
        }

        return (
            <div className="cajaAgentes">
                 <Card>
                   <CardHeader className="tituloTabla">{this.props.titulo}</CardHeader>                
                    <CardText tag="div">
                        <AgentsTable data={this.props.datosAgentes} titulo={this.props.titulo} />
                    </CardText>
                    {/* <Button onClick={() => { this.props.buttonAdd(this.props.titulo) }}>+</Button>*/}
                            {this.props.renderB===true?renderButton():''}         
                    <AddAgent mostrarContenido={this.state.muestraAdd}/>                                  
                </Card> 
                
            </div>
        );
    }
}
ExpedientContainer.propTypes = {
    
};
ExpedientContainer.defaultProps = {
    
    loading: false
  };
const mapStateToProps = state => ({
    //datosAgentes:state.expedientes.datosAgentes ? state.expedientes.datosAgentes:""
   
  });
 

export default connect(mapStateToProps,)(ExpedientContainer);