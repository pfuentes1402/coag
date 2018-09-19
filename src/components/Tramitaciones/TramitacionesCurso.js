import React, { Component } from 'react'
import {CardBody} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import 'ag-grid/dist/styles/ag-theme-material.css';
import PropTypes from 'prop-types';
import {traduccionGrid, traduccionGridGallego} from './../../helpers/traducciones';
import AccionRenderer from './AccionRenderer';
import EstadoRenderer from './EstadoRenderer';
import { connect } from 'react-redux';
import { gotrabajos } from './../../actions/usuarios'
import { setSelectedExpedienteTo, fetchExpedienteDatosGeneral, fetchExpedienteTrabajos } from './../../actions/expedientes'
import { fetchEstructuraDocumentalTrabajo } from './../../actions/trabajos'
import estructurahelper  from './../../helpers/estructuraDoc'
import 'ag-grid/dist/styles/ag-theme-material.css';


function internationalization (param){
 
    return param==='es'?traduccionGrid:traduccionGridGallego
}

class TramitacionesCurso extends Component {
    constructor(props) {
        super(props);
       
       

        this.state = {
            columnDefs: [
                {headerName: "COD ESTUDIO", field: "Expediente_Codigo_estudio", width: 140},                
                {headerName: "TITULO EXPEDIENTE", field: "Titulo_Expediente", width: 200},
                {headerName: "TITULO TRABAJO", field: "Titulo_Documento", width: 200},
                {headerName: "MUNICIPIO", field: "Municipio", width: 200},
                {headerName: "PROMOTOR", field: "Promotor", width: 200},
                {headerName: "ESTADO", field: "Estado", cellRenderer:'estadoRenderer', colId: "estado", width: 200},
                {headerName: "ACCIONES", field: "acciones", cellRenderer:'accionRenderer', colId: "params", width: 140},
                {headerName: "ULTIMA MOD.", field: "Ultima_Modificacion", width: 140,
                },             
            ]          
            ,
            context: {componentParent: this},
            frameworkComponents: {
                accionRenderer: AccionRenderer,
                estadoRenderer: EstadoRenderer},
            components: {
                    rowNodeIdRenderer: function (params) {
                        return params.node.id + 1;
                    }
                },                
                rowGroupPanelShow: "always",
                paginationPageSize:10,
                
                localeText: internationalization(this.props.lang),
                rowSelection: "single",
            rowData: this.props.data,
            
        
        }


    }
    onGridReady(params) {
        this.gridApi = params.api        
        this.gridColumnApi = params.columnApi
        
        
    };
    onPageSizeChanged(newPageSize) {
        var value = document.getElementById("page-size").value;
        this.gridApi.paginationSetPageSize(Number(value));
       
      }
      onSelectionChanged(){
        var selectedRows = this.gridApi.getSelectedRows();
        this.props.setSelectedExpedienteTo(selectedRows[0]);
        
        this.props.fetchExpedienteDatosGeneral(selectedRows[0].Id_Expediente);
        this.props.fetchExpedienteTrabajos(selectedRows[0].Id_Expediente);
        this.props.fetchEstructuraDocumentalTrabajo(selectedRows[0].Id_Expediente,selectedRows[0].Id_Trabajo);
       
        //let test = estructurahelper(this.props.datosBrutos)
        
        this.props.gotrabajos();

      }
  

       onBtExport() {

           var params = {
               columnGroups: true,
               allColumns: true,
               fileName: "export.csv",


           };
           console.log("Boton exportar csv")
           this.gridApi.exportDataAsCsv(params);
       }

   


    render() {
        return (
            <CardBody  className="card-body-Trabajos">
                <div
                //   className="ag-theme-material"
                  className="ag-theme-balham"
                  style={{ 
                    boxSizing: "border-box",
	                height: '400px', 
                    width: '1440px',
                    margin: '0px',
                    border: '#E0E0E0 solid 1px'}} 
		            >
                    <div >
                           Mostrar:
                            <select onChange={this.onPageSizeChanged.bind(this)} id="page-size">
                                <option value="10" selected="">10</option>
                                <option value="20">20</option>
                                <option value="30">30</option>
                                <option value="100">100</option>
                            </select>
                     </div>
                    
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        context={this.state.context}
                        frameworkComponents={this.state.frameworkComponents}
                        rowData={this.props.data}
                       
                          enableSorting = {
                              true
                          }
                          enableFilter = {
                              false
                          }
                          floatingFilter={
                              true
                            }
                         
                          enableColResize = {
                              true
                          }
                          showToolPanel = {
                              true
                          }
                          pagination = {
                              true
                          }
                          paginationPageSize={
                              this.state.paginationPageSize
                              }
                            rowGroupPanelShow = {
                                this.state.rowGroupPanelShow
                            }
                            enableStatusBar = {
                                true
                            }
                            localeText = {
                                this.state.localeText
                            }
                           onGridReady = {
                               this.onGridReady.bind(this)
                           }
                           rowSelection={this.state.rowSelection} 
                           onSelectionChanged={this.onSelectionChanged.bind(this)}                        
                    
                            >
                    </AgGridReact>
                    <div>
                        <button onClick={this.onBtExport.bind(this)} > Exportar a CSV </button>
                    </div>
                </div>
          
                </CardBody>
            );
    }
}

const propTypes = {
    data: PropTypes.array,
}

const mapStateToProps = state => ({
    datosBrutos:state.trabajos.estructuraDocumentalTrabajo || '',
  });


export default connect(mapStateToProps,{ gotrabajos, setSelectedExpedienteTo, fetchExpedienteDatosGeneral,
     fetchExpedienteTrabajos, fetchEstructuraDocumentalTrabajo })(TramitacionesCurso);