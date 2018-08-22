import React, { Component } from 'react';
import { connect } from 'react-redux';
import {CardBody} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';
import {traduccionGrid} from './../../helpers/traducciones';
import { goExpedientesUser } from './../../actions/usuarios/index';
import { fetchExpedienteDatosGeneral } from './../../actions/expedientes/index';




const propTypes = {
    data: PropTypes.array,
}
class TablaDatosModal extends Component {
   
    constructor(props) {
        super(props);
 
        this.state = {
            columnDefs: [
                {headerName: "COD. EXP", field: "Expediente_Codigo", width: 55},                
                {headerName: "TITULO", field: "Titulo", width: 140},              
                
                {headerName: "F.ENTRADA", field: "Fecha_Entrada", width: 120},
                {headerName: "MUNICIPIO", field: "Concello", width: 120},                       
                {headerName: "EMPLAZAMIENTO", field: "Emplazamiento", width: 60},             
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
                rowSelection: "single",
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
        console.log(this.gridApi)
        this.gridColumnApi = params.columnApi

    };
    handdlefiltro(){
        console.log()
    }

    onSelectionChanged() {
        var selectedRows = this.gridApi.getSelectedRows();
        console.log(selectedRows);       
       this.props.goExpedientesUser();
       this.props.fetchExpedienteDatosGeneral(selectedRows[0].Expediente_Codigo);      
      }
   


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
                          
                          enableColResize = {
                              true
                          }
                          showToolPanel = {
                              true
                          }
                          pagination = {
                              true
                          }
                          floatingFilter={true}

                            rowGroupPanelShow = {
                                this.state.rowGroupPanelShow
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
                </div>
                </CardBody>
            );
    }
}
TablaDatosModal.propTypes = propTypes;

const mapStateToProps = state => ({
   
  });


export default connect(mapStateToProps,{goExpedientesUser, fetchExpedienteDatosGeneral})(TablaDatosModal);