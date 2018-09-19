import React, { Component } from 'react';
import { connect } from 'react-redux';
import {CardBody} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

import {traduccionGrid} from './../../helpers/traducciones';
import { goExpedientesUser } from './../../actions/usuarios/index';
import { fetchExpedienteDatosGeneral } from './../../actions/expedientes/index';
import { setSelected } from './../../actions/usuarios/index';





class TablaBusquedaArquitectos extends Component {
    constructor(props) {
        super(props);
 
        this.state = {
            columnDefs: [
                {headerName: "NIF", field: "Nif", width: 93},                
                {headerName: "NOMBRE", field: "Nombre", width: 140},                
                {headerName: "APELLIDOS", field: "Apellido1", width: 120},
                {headerName: "MUNICIPIO", field: "Concello", width: 120},
                {headerName: "ID ENTIDAD", field: "Id_Entidad", width: 148},             
            ]          
            ,
            components: {
                    rowNodeIdRenderer: function (params) {
                        return params.node.id + 1;
                    }
                },
                
                rowGroupPanelShow: "always",
                quickFilterText: null,
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
        this.gridColumnApi = params.columnApi

    };
    onSelectionChanged() {
        /*A traves de este evento se envia al redux los datos de la fila seleccionada, estos datos son consumidos por el propio componente
        para en un redux form poder editar estos datos y añadir más agentes*/
        var selectedRows = this.gridApi.getSelectedRows();
        console.table(selectedRows[0]);
        this.props.setSelected(selectedRows[0]);
       
    };    
    onBtExport() {
        var params = {
            columnGroups: true,
            allColumns: true,
            fileName: "export.csv",
        };       
        this.gridApi.exportDataAsCsv(params);
    };

    filtrado= (e)=> {
        this.setState({ quickFilterText: e.target.value });
    }

    render() {

        const RenderFiltros =() =>{
            return (
                <div>
                     <input type="text" id="filter-text-box" placeholder="Filtro" onChange={this.filtrado} />
                </div>
        )
        }


        return (
            <CardBody className="card-body-Trabajos">
                <div
                    className="ag-theme-balham"
                    style={{
                        height: '250px',
                        width: '650px',
                        margin: '0px'
                    }}
                >
                    {/* <div style={{ float: "left", marginLeft: 20 }}>
                        <input type="text" id="filter-text-box" placeholder="Filtro" onChange={this.filtrado} />
                    </div> */}
                    <div>
                        {this.props.muestraFiltros === true ? RenderFiltros() : ''}
                    </div>                   
                   
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.props.data}

                        enableSorting={true}
                        enableFilter={
                            true
                        }

                        enableColResize={
                            true
                        }
                        suppressCsvExport={
                            false
                        }
                        showToolPanel={
                            true
                        }
                        pagination={
                            true
                        }
                        floatingFilter={true}

                        rowGroupPanelShow={
                            this.state.rowGroupPanelShow
                        }
                        localeText={
                            this.state.localeText
                        }
                        onGridReady={
                            this.onGridReady.bind(this)
                        }
                        rowSelection={this.state.rowSelection}
                        quickFilterText={this.state.quickFilterText}
                        onSelectionChanged={this.onSelectionChanged.bind(this)}
                    >
                    </AgGridReact>
                    <div>
                        <button onClick={this.onBtExport.bind(this)}> Exportar a CSV </button>
                    </div>
                </div>
            </CardBody>
        );
    }
}


const mapStateToProps = state => ({
   FiltroMuestra:state.user.filtroBusqueda||'',
   muestraFiltros:state.status.muestraFiltros ||'', 
  });


export default connect(mapStateToProps,{goExpedientesUser, fetchExpedienteDatosGeneral,setSelected})(TablaBusquedaArquitectos);