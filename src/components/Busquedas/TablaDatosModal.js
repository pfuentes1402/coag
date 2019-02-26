import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import {traduccionGrid} from './../../helpers/traducciones';
import { goExpedientesUser } from './../../actions/usuarios/index';
import {Button} from "@material-ui/core";
import {postExpedienteAccion} from '../../api';
import {fetchErrorExpediente, formatMenssage} from "../../actions/expedientes";

class TablaDatosModal extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            columnDefs: [
                {headerName: "COD. EXP", field: "Id_Expediente", width: 93},
                {headerName: "TITULO", field: "Titulo", width: 140},
                {headerName: "F.ENTRADA", field: "Fecha_Entrada", width: 120},
                {headerName: "MUNICIPIO", field: "Concello", width: 120},
                {headerName: "EMPLAZAMIENTO", field: "Emplazamiento", width: 148},
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
        };


    }
    onGridReady(params) {
        this.gridApi = params.api        
        this.gridColumnApi = params.columnApi

    };
    async onSelectionChanged() {
        let selectedRows = this.gridApi.getSelectedRows();
        let idExpediente = selectedRows[0].Id_Expediente;
        this.props.goExpedientesUser(); /*para ocultarl el modal de busqueda*/
        if(this.props.modal){
            if(this.props.isTrabajo){
                this.props.history.push("/visualizar-expediente/" + idExpediente + "/" + selectedRows[0].Id_Trabajo);
            }else
            {
                this.props.history.push("/visualizar-expediente/" + idExpediente);
            }
        }
        else {
            let idAccion = this.props.idAccion;
            switch (idAccion) {
                case 1:
                    this.props.history.push("/visualizar-expediente/" + idExpediente);
                    break;
                case 2:
                    await this.urlAccion(idExpediente,idAccion, 0)
                    break;
                case 3:
                    await this.urlAccion(idExpediente,idAccion, 0)
                    break;
                case 4:
                    await this.urlAccion(idExpediente,idAccion, 1)
                    break;
                case 5:
                    await this.urlAccion(idExpediente,idAccion, 0)
                    break;
                case 6:
                    await this.urlAccion(idExpediente,idAccion, 0)
                    break;
            }
        }
    };

    async urlAccion(id_expediente, id, ignorarObservaciones){
        try {
            let response = await postExpedienteAccion(id_expediente, id, ignorarObservaciones);
            if(id === 5){
                await this.props.history.push("/comunicacion/" + id_expediente );
            }
            else {
                if( response.MensajesProcesado && response.MensajesProcesado.length > 0){
                    await this.props.fetchErrorExpediente(response);
                }
                else {
                    if(id === 4){
                        await this.props.history.push("/visualizar-expediente/" + id_expediente + "/" + response.Trabajos[0].Id_Trabajo);
                    }else {
                        if(id === 2){
                            if(response.InfoAccion[0].Id_Asistente == 1){
                                await this.props.history.push("/crear-trabajo/" + id_expediente);
                            }else {
                                await this.props.history.push("/comunicacion/" + id_expediente );
                            }
                        }else {
                            window.open(response.InfoAccion[0].Url, '_blank');
                        }
                    }

                }
            }
        }
        catch (e) {
            this.props.fetchErrorExpediente(formatMenssage(e.message));
        }
    }

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

        return (
            <div
                className="ag-theme-balham"
                style={{
                    height: '250px',
                    width: '100%',
                }}
            >


                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.props.data ? this.props.data : []}

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
                <div className="pt-3 text-right">
                    <Button variant="contained" color="primary" onClick={this.onBtExport.bind(this)}>
                        Exportar a CSV
                    </Button>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    FiltroMuestra: state.user.filtroBusqueda ? state.user.filtroBusqueda :'',
    muestraFiltros: state.status.muestraFiltros ? state.status.muestraFiltros : '',
    modal: state.status.modal ? state.status.modal : '',
    idAccion: state.user.idAccion ? state.user.idAccion : 0,
  });

const mapDispatchToProps = {
    goExpedientesUser,
    fetchErrorExpediente

};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TablaDatosModal));