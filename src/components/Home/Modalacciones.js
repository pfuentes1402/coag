import React, {Component} from 'react';
import {Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { fetchocultaModal, fetchCambiaStadoModalFalse } from '../../actions/interfaz/index'
import {fetchBuscador } from '../../actions/expedientes/index'

import './styles.css';
import TablaDatosModal from '../Busquedas/TablaDatosModal';





class Modalacciones extends Component { 

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
        // const RenderComponenteAcciones=()=>{
        //     return (
        //         <div>
        //             <div>
        //                 <div className="Titulo">
        //                     <p>{this.props.tituloModal}</p>
        //                 </div>                        
        //                 <span className="descripcion">{this.props.descripcion}</span>    
        //             </div>
        //             <div>
        //             <input type="text"  onChange={this.props.fetchBuscador} />
        //             </div>
        //             <button>Cancelar</button>
        //             <button>Buscar</button>

        //             <div>
        //                 <div>
        //                     <div>
        //                         <span>Resultados</span><span className="colorAzul">({this.props.datosTabla.length})</span> 
        //                     </div>
        //                     <TablaDatosModal data={this.props.datosTabla} />
        //                 </div>
                    
        //             </div> 
        //         </div>
        // )
           
        // }

        // const RenderComponenteBuscador=()=>{
        //     return (
        //         <div>
        //             <div>
        //                 <div className="Titulo">
        //                     <p>Busqueda</p>
        //                 </div>                        
        //                 <span className="descripcion">{this.props.descripcion}</span>    
        //             </div>
        //             <div>
        //             <input type="text"  onChange={this.props.fetchBuscador} />
        //             <select/>
        //             </div>
        //             <button>Cancelar</button>
        //             <button>Buscar</button>

        //             <div>
        //                 <div>
        //                     <div>
        //                         <span>Resultados</span><span className="colorAzul">({this.props.datosTabla.length})</span> 
        //                     </div>
        //                     <TablaDatosModal data={this.props.datosTabla} />
        //                 </div>
                    
        //             </div> 
        //         </div>
        // )
        // }

        const RenderComponents = ()=>{
            console.log(this.props.modal)
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
                            <input type="text"  onChange={this.props.fetchBuscador} />
                            <select/>
                            </div>
                            <button>Cancelar</button>
                            <button>Buscar</button>

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
                        <input type="text"  onChange={this.props.fetchBuscador} />
                        </div>
                        <button>Cancelar</button>
                        <button>Buscar</button>
    
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
            //this.props.modal===true ? RenderComponenteBuscador(): RenderComponenteAcciones();
            
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
    tituloModal:state.user.datosModal.tituloModal ||'', 
    descripcion:state.user.datosModal.descripcion ||'', 
    modal:state.status.modal ||'', 
  });


  
  

export default connect(mapStateToProps,{ fetchocultaModal, fetchCambiaStadoModalFalse, fetchBuscador })(Modalacciones);


