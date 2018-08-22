import React, {Component} from 'react';
import {Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchocultaModal, fetchCambiaStadoModalFalse } from '../../actions/interfaz/index'
import {fetchBuscador } from '../../actions/expedientes/index'
import './styles.css';
import TablaDatosModal from '../Busquedas/TablaDatosModal';
import {createStore} from 'redux'





class Modalacciones extends Component { 
    
    constructor(props) {
        super(props);
       
        this.state = { filtro:'' };
       
      }

    handdlebuscador = (e) =>{
        console.log(e.target.value);
        this.props.fetchBuscador(e.target.value);
    }
    componentDidMount(){
        this.props.fetchBuscador(this.props.filtroBusqueda);
    }

    render() {
     
       
        const handleclick = ()=>{    
            console.log("Cierra el modal");
            this.props.fetchocultaModal();
            this.props.fetchCambiaStadoModalFalse();
            
            
         }
        
       
      

         const loading =() =>{
            return (<div>
                    <p>Loading...</p>
            </div>)
        }

        const RenderComponents = ()=>{
           switch(this.props.modal){
               case true:
                    return (
                        <div>
                            <div>
                                <div className="Titulo">
                                    <p>Busqueda</p>
                                </div>                        
                                <span className="descripcion">{this.props.descripcion}</span>    
                            </div>
                            <div>
                            <input type="text"  value={this.props.filtroBusqueda} onChange={(e)=>{this.handdlebuscador(e)}} />
                            <select/>
                            </div>
                            <button>Cancelar</button>
                            <button>Buscar</button>

                            <div>
                                <div>
                                    <div>
                                        <span>Resultados</span><span className="colorAzul">({this.props.datosTablaResult.length})</span> 
                                    </div>
                                    <TablaDatosModal data={this.props.datosTablaResult} />
                                </div>
                            
                            </div> 
                        </div>
                )
                default:
                return (
                    <div>
                        <div>
                            <div className="Titulo">
                                <p>{this.props.tituloModal}</p>
                            </div>                        
                            <span className="descripcion">{this.props.descripcion}</span>    
                        </div>
                        <div>                      
                       
                        </div>                    
    
                        <div>
                            <div>
                                <div>
                                    <span>Resultados</span><span className="colorAzul">({this.props.datosTabla.length})</span> 
                                </div>
                                <TablaDatosModal data={this.props.datosTabla} />
                            </div>
                        
                        </div> 
                    </div>
            )
           }           
        }
  
        return (           

            <div className="muestrate">
                <Container className="full">
                    <Row className="principal">                   
                                                                    
                    
                        <Col xs="12" sm="12">                        
                            <div className='divderecha'>
                        <button onClick={()=>handleclick()}>X</button>                            
                             {this.props.loading === true ?loading(): RenderComponents()}
                            </div>                               
                        </Col>    
                            
                    </Row>
                    
                </Container>
            </div>
        );
    }
}




const mapStateToProps = state => ({
    loading:state.status.modalLoading || '',
    datosTabla:state.user.datosModal.expedientes ||'', 
    datosTablaResult:state.user.datosModal.resultados ||'', 
    tituloModal:state.user.datosModal.tituloModal ||'', 
    descripcion:state.user.datosModal.descripcion ||'', 
    modal:state.status.modal ||'',
    filtroBusqueda:state.user.filtroBusqueda ||'', 
  });


  
  

export default connect(mapStateToProps,{ fetchocultaModal, fetchCambiaStadoModalFalse, fetchBuscador })(Modalacciones);


