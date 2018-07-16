import React, { Component } from 'react'
import {CardBody} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';
import {traduccionGrid} from './../../helpers/traducciones'


const propTypes = {
    data: PropTypes.array,
}
class TramitacionesCurso extends Component {
    constructor(props) {
        super(props);
 
        this.state = {
            columnDefs: [
                {headerName: "COD ESTUDIO", field: "Expediente_Codigo_estudio", width: 140},                
                {headerName: "TITULO EXPEDIENTE", field: "Titulo_Expediente", width: 180},
                {headerName: "TITULO TRABAJO", field: "Titulo_Documento", width: 180},
                {headerName: "MUNICIPIO", field: "Municipio", width: 180},
                {headerName: "ESTADO", field: "Estado", width: 180},
                {headerName: "ACCIONES", field: "acciones", width: 140},             
            ]          
            ,
            components: {
                    rowNodeIdRenderer: function (params) {
                        return params.node.id + 1;
                    }
                },                
                rowGroupPanelShow: "always",
                paginationPageSize: 20,
                localeText: traduccionGrid,
            rowData: this.props.data            
            ,
            
        }


    }
    onGridReady(params) {
        this.gridApi = params.api
        console.log(this.gridApi)
        this.gridColumnApi = params.columnApi

    };


    render() {
        return (
            <CardBody  className="card-body-Trabajos">
                <div 
                  className="ag-theme-balham"
                  style={{ 
	                height: '250px', 
                    width: '100%',
                    margin: '0px'}} 
		            >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.props.data}
                       
                          enableSorting = {
                              true
                          }
                          enableFilter = {
                              true
                          }
                          rowSelection = "multiple" 
                          enableColResize = {
                              true
                          }
                          showToolPanel = {
                              true
                          }
                          pagination = {
                              true
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
                           } >
                    </AgGridReact>
                </div>
                </CardBody>
            );
    }
}


export default TramitacionesCurso;