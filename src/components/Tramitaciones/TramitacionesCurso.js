import React, { Component } from 'react'
import {CardBody} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';
import {traduccionGrid} from './../../helpers/traducciones'



class TramitacionesCurso extends Component {
    constructor(props) {
        super(props);
 
        this.state = {
            columnDefs: [
                {headerName: "COD ESTUDIO", field: "Expediente_Codigo_estudio", width: 140},                
                {headerName: "TITULO EXPEDIENTE", field: "Titulo_Expediente", width: 200},
                {headerName: "TITULO TRABAJO", field: "Titulo_Documento", width: 200},
                {headerName: "MUNICIPIO", field: "Municipio", width: 200},
                {headerName: "ESTADO", field: "Estado", width: 200},
                {headerName: "ACCIONES", field: "acciones", width: 140,
                },             
            ]          
            ,
            components: {
                    rowNodeIdRenderer: function (params) {
                        return params.node.id + 1;
                    }
                },                
                rowGroupPanelShow: "always",
                paginationPageSize:10,
                localeText: traduccionGrid,
            rowData: this.props.data            
            ,
            
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


    render() {
        return (
            <CardBody  className="card-body-Trabajos">
                <div 
                  className="ag-theme-balham"
                  style={{ 
	                height: '400px', 
                    width: '1350px',
                    margin: '0px'}} 
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
                           } >
                    </AgGridReact>
                </div>
          
                </CardBody>
            );
    }
}

const propTypes = {
    data: PropTypes.array,
}

export default TramitacionesCurso;