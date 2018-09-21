import React, { Component } from 'react'
import {CardBody} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';
import {traduccionGrid} from './../../helpers/traducciones'
import "./ListWorks.css";

const propTypes = {
    data: PropTypes.array,
}
class TablaTrabajos extends Component {
    constructor(props) {
        super(props);
 
        this.state = {
            columnDefs: [
                {headerName: "Nº", field: "Id_Trabajo", width: 55},                
                {headerName: "TITULO TRABAJO", field: "Titulo", width: 140},
                {headerName: "ESTADO", field: "Estado", width: 80},
                {headerName: "F.ENTRADA", field: "Fecha_Entrada", width: 120},
                {headerName: "F.VIASADO", field: "Fecha_Visado", width: 120},
                {headerName: "INC", field: "inc", width: 60},             
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
            rowData: [
                {numero: "Aragón", Titulo: "", estado: 3, fecha_entrada: 36202, fecha_visado: "Vigo", inc: ""}
            ],
            trabajo:[
                {Id_Trabajo: "", Titulo: "", Estado: "", fecha_entrada:"", fecha_visado: "", inc: ""}
            ],
        }


    }
    onGridReady(params) {
        this.gridApi = params.api
  
        this.gridColumnApi = params.columnApi

    };


    render() {
        return (
            <CardBody  className="card-body-Trabajos">
                <div 
                  className="ag-theme-balham"
                  style={{ 
	                height: '250px', 
                    width: '580px',
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
TablaTrabajos.propTypes = propTypes;

export default TablaTrabajos;