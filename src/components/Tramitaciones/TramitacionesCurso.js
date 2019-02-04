import React, { Component } from 'react'
import {CardBody, Col, Row} from 'reactstrap';
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
import 'ag-grid/dist/styles/ag-theme-material.css';
import { Button } from 'reactstrap';
import {withRouter} from "react-router-dom";

function internationalization (param){
 
    return param==='1'? traduccionGrid :  traduccionGridGallego
}

const styles = ({
    title: {
        fontWeight: 600,
        padding: "16px 8px 0px 16px"
    },
    col: {
        padding: 0
    },

})

class TramitacionesCurso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                {headerName: "COD ESTUDIO", field: "Expediente_Codigo_estudio", width: 140},                
                {headerName: "TITULO EXPEDIENTE", field: "Titulo_Expediente", width: 200},
                {headerName: "TITULO TRABAJO", field: "Titulo_Documento", width: 200},
                {headerName: "MUNICIPIO", field: "Municipio", width: 200},
                {headerName: "ESTADO", field: "Estado", cellRenderer:'estadoRenderer', colId: "estado", width: 180},
                {headerName: "ACCIONES", field: "acciones", cellRenderer:'accionRenderer', colId: "params", width: 140},
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
          this.props.history.push("/visualizar-expediente/" + selectedRows[0].Id_Expediente);
      }
  

       onBtExport() {

           var params = {
               columnGroups: true,
               allColumns: true,
               fileName: "export.csv",
           };
           
           this.gridApi.exportDataAsCsv(params);
       }

   


    render() {
        return (
            <CardBody className="card-body-Trabajos">
                <Row  style={{
                    boxSizing: "border-box",
                    border: '#E0E0E0 solid 1px', backgroundColor: "#FFFFFF"}}>
                    <Col style={styles.col}>
                        <div style={{display: "flex",
                            justifyContent: "space-between"}}>
                            <div>
                               <label style={styles.title}>Tramitaciones en Curso <label className="text-primary">{"(" + (this.props.data ? this.props.data.length : 0) + ")"}</label></label>
                            </div>
                            <div>
                                <label style={styles.title}>
                                    Mostrar:
                                </label>
                                <select onChange={this.onPageSizeChanged.bind(this)} id="page-size" style={{marginRight: 16}}>
                                    <option value="10" selected="">10</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col style={styles.col}>
                        <div className="ag-theme-balham" style={{
                            height: '400px',
                            width: '100%',
                            margin: '0px'}}>
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
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col style={{textAlign: "end"}}>
                        <Button style={{margin: 8}} color="primary" onClick={this.onBtExport.bind(this)} > Exportar a CSV </Button>
                    </Col>
                </Row>
            </CardBody>
            );
    }
}

const propTypes = {
    data: PropTypes.array,
}

const mapStateToProps = state => ({
    datosBrutos: state.trabajos.estructuraDocumentalTrabajo ? state.trabajos.estructuraDocumentalTrabajo : '',
  });


export default withRouter(connect(mapStateToProps,{ gotrabajos, setSelectedExpedienteTo, fetchExpedienteDatosGeneral,
     fetchExpedienteTrabajos, fetchEstructuraDocumentalTrabajo })(TramitacionesCurso));