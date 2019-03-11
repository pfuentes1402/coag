import React, { Component } from 'react'
import { CardBody, Col, Row } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import 'ag-grid/dist/styles/ag-theme-material.css';
import { traduccionGrid, traduccionGridGallego } from './../../helpers/traducciones';
import AccionRenderer from './AccionRenderer';
import EstadoRenderer from './EstadoRenderer';
import { connect } from 'react-redux';
import { gotrabajos } from './../../actions/usuarios'
import { setSelectedExpedienteTo, fetchExpedienteDatosGeneral, fetchExpedienteTrabajos } from './../../actions/expedientes'
import { fetchEstructuraDocumentalTrabajo } from './../../actions/trabajos';
import { dispatchTablePersonalization } from './../../actions/expedientes';
import 'ag-grid/dist/styles/ag-theme-material.css';
import { Button } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { Select, MenuItem, Checkbox, ListItemText, Typography } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles/index";

function internationalization(param) {
    return param === '1' ? traduccionGrid : traduccionGridGallego
}

const styles = theme => ({
    title: {
        fontWeight: 600,
        padding: "12px 8px 0px 12px"
    },
    col: {
        padding: 0
    },
    head: {
        display: "flex",
        [theme.breakpoints.down('sm')]: {
            display: "inline",
        },
        justifyContent: "space-between"
    },

})

class TramitacionesCurso extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: this.renderColumns().filter(x => x.selected),
            allColumns: this.renderColumns(),
            //renderValue: null,
            context: { componentParent: this },
            frameworkComponents: {
                accionRenderer: AccionRenderer,
                estadoRenderer: EstadoRenderer
            },
            components: {
                rowNodeIdRenderer: function (params) {
                    return params.node.id + 1;
                }
            },
            rowGroupPanelShow: "always",
            paginationPageSize: 30,
            localeText: internationalization(this.props.lang),
            rowSelection: "single",
            rowData: this.props.data,
            pageSize: this.props.tablePersonalization.pageSize,
            gridApi: null,
            gridColumnApi: null,
            openChooser: false
        }
    }

    async componentDidMount() {
        await this.renderColumnsAsync();
        this.setState({
            renderValue: this.props.tablePersonalization.renderValue,
            columnDefs: this.renderColumns().filter(x => x.selected),
            allColumns: this.renderColumns()
        });
    }

    renderColumns() {
        if (this.props.tablePersonalization.columnDefs.length === 0) {
            let columns = [
                { headerName: "CÓDIGO", field: "Expediente_Codigo", width: 100, pinned: null, selected: false },
                { headerName: "COD ESTUDIO", field: "Expediente_Codigo_estudio", width: 140, pinned: null, selected: true },
                { headerName: "TITULO EXPEDIENTE", field: "Titulo_Expediente", width: 200, selected: true },
                { headerName: "TITULO TRABAJO", field: "Titulo_Trabajo", width: 200, selected: true },
                { headerName: "MUNICIPIO", field: "Concello", width: 200, selected: true },
                { headerName: "ESTADO", field: "Estado", cellRenderer: 'estadoRenderer', colId: "estado", width: 180, selected: true },
                { headerName: "ACCIONES", field: "acciones", cellRenderer: 'accionRenderer', colId: "params", width: 140, selected: true, cellClass: 'no-border', sortable: false, pinned: null, filter: null },
                { headerName: "ANTECEDENTES", field: "Antecedente", width: 140, selected: false, pinned: null },
                { headerName: "FECHA ENTRADA", field: "Fecha_Entrada", width: 140, selected: false, pinned: null },
                { headerName: "FECHA TRAMITACIÓN", field: "Fecha_Tramitacion", width: 140, selected: false, pinned: null },
                { headerName: "PROMOTOR", field: "Promotor", width: 140, selected: false, pinned: null },
                { headerName: "ÚLTIMA MODIFICACIÓN", field: "Ultima_Modificacion", width: 140, selected: false, pinned: null }
            ];
            this.props.dispatchTablePersonalization(
                this.state && this.state.pageSize ? this.state.pageSize : 30, columns, "Columnas por defecto");
            return columns;
        }
        return this.props.tablePersonalization.columnDefs;
    }

    async renderColumnsAsync() {
        if (this.props.tablePersonalization.columnDefs.length === 0) {
            let columns = [
                { headerName: "CÓDIGO", field: "Expediente_Codigo", width: 100, pinned: null, selected: false },
                { headerName: "COD ESTUDIO", field: "Expediente_Codigo_estudio", width: 140, pinned: null, selected: true },
                { headerName: "TITULO EXPEDIENTE", field: "Titulo_Expediente", width: 200, selected: true },
                { headerName: "TITULO TRABAJO", field: "Titulo_Trabajo", width: 200, selected: true },
                { headerName: "MUNICIPIO", field: "Concello", width: 200, selected: true },
                { headerName: "ESTADO", field: "Estado", cellRenderer: 'estadoRenderer', colId: "estado", width: 180, selected: true },
                { headerName: "ACCIONES", field: "acciones", cellRenderer: 'accionRenderer', colId: "params", width: 140, selected: true, cellClass: 'no-border', sortable: false, pinned: null, filter: null },
                { headerName: "ANTECEDENTES", field: "Antecedente", width: 140, selected: false, pinned: null },
                { headerName: "FECHA ENTRADA", field: "Fecha_Entrada", width: 140, selected: false, pinned: null },
                { headerName: "FECHA TRAMITACIÓN", field: "Fecha_Tramitacion", width: 140, selected: false, pinned: null },
                { headerName: "PROMOTOR", field: "Promotor", width: 140, selected: false, pinned: null },
                { headerName: "ÚLTIMA MODIFICACIÓN", field: "Ultima_Modificacion", width: 140, selected: false, pinned: null }
            ];
            await this.props.dispatchTablePersonalization(
                this.state && this.state.pageSize ? this.state.pageSize : 30, columns, "Columnas por defecto");
        }
        if (this.gridApi)
            this.gridApi.redrawRows();
        return this.props.tablePersonalization.columnDefs;
    }

    onGridReady(params) {
        this.gridApi = params.api
        this.gridColumnApi = params.columnApi
    };
    onPageSizeChanged(event) {
        this.setState({ pageSize: event.target.value })
        this.props.dispatchTablePersonalization(event.target.value, this.state.allColumns,
            this.props.tablePersonalization.renderValue);
        this.gridApi.paginationSetPageSize(event.target.value);
        this.resizeTable(event.target.value);
    }
    onSelectionChanged() {
        var selectedRows = this.gridApi.getSelectedRows();
        let column = this.gridApi.getFocusedCell();
        if (column && column.column && column.column.colId === "params")
            return;
        this.props.history.push("/visualizar-expediente/" + selectedRows[0].Id_Expediente + "/" + selectedRows[0].Id_Trabajo);
    }


    onBtExport() {
        var params = {
            columnGroups: true,
            allColumns: true,
            fileName: "export.csv",
        };
        this.gridApi.exportDataAsCsv(params);
    }

    onGridSizeChanged(params) {
        var renderedRows = params.api.getRenderedNodes();
        if (renderedRows.length > 0)
            this.resizeTable(this.state.pageSize);
    }

    resizeTable(rows) {
        if (rows > 0) {
            rows = rows <= this.props.data.length
                ? rows : this.props.data.length;

            let minRowHeight = 48;
            document.getElementById("myGrid").style.height = `${rows * minRowHeight + 190}px`;
            document.getElementById("myGrid").style.minHeight = `${rows * minRowHeight + 190}px`;
            document.getElementsByClassName("ag-body-viewport")[0].style.height = `${rows * minRowHeight + 20}px`;
        }
    }

    refreshTable() {
        this.gridApi.setColumnDefs(this.state.columnDefs);
        this.gridApi.redrawRows();
    }

    handleSelectColumn = async event => {
        try {
            let newColumn = event.target.value.length > 0
                ? event.target.value[event.target.value.length - 1]
                : null;
            if (newColumn) {
                let allColumns = [];
                Object.assign(allColumns, this.state.allColumns);
                let selectColumn = allColumns.findIndex(x => x.field === newColumn);
                if (selectColumn > -1) {
                    allColumns[selectColumn].selected = !allColumns[selectColumn].selected;
                    this.setState({
                        allColumns: allColumns,
                        columnDefs: allColumns.filter(x => x.selected),
                        //renderValue: "Columnas personalizadas"
                    });
                    await this.props.dispatchTablePersonalization(this.state.pageSize, allColumns, "Columnas personalizadas");
                    this.gridApi.setColumnDefs(this.state.columnDefs);
                }
            }
            else {
                await this.props.dispatchTablePersonalization(this.state.pageSize, [], "Columnas por defecto");
                this.setState({
                    allColumns: this.renderColumns(),
                    columnDefs: this.renderColumns().filter(x => x.selected),
                    //renderValue: "Columnas por defecto",
                    openChooser: false
                });
                this.gridApi.setColumnDefs(this.state.columnDefs);
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        let { classes } = this.props;
        console.log("datas-changed", this.props.data);

        return (
            <CardBody className="card-body-Trabajos">
                <Row style={{
                    boxSizing: "border-box",
                    border: '#E0E0E0 solid 1.5px', backgroundColor: "#FFFFFF"
                }}>
                    <Col style={styles.col}>
                        <div className={classes.head}>
                            <div className="d-flex p-2">
                                <Typography variant="h6" gutterBottom className="mb-0">
                                    Tramitaciones en Curso
                                </Typography>
                                <Typography variant="h6" color="primary" gutterBottom className="mb-0">
                                    {"(" + (this.props.data ? this.props.data.length : 0) + ")"}
                                </Typography>
                            </div>
                            <div className="d-flex p-2">
                                <Typography variant="h6" gutterBottom className="mb-0">
                                    Mostrar
                                </Typography>
                                <Select style={{ width: 230 }}
                                    value={this.state.columnDefs}
                                    multiple
                                    onChange={this.handleSelectColumn}
                                    className="mx-3"
                                    renderValue={x => this.props.tablePersonalization.renderValue}
                                    onOpen={() => { this.setState({ openChooser: true }) }}
                                    onClose={() => { this.setState({ openChooser: false }) }}
                                    open={this.state.openChooser}>
                                    <MenuItem key={0} value={null}>
                                        <Checkbox color="primary" checked={false} />
                                        <ListItemText primary="Columnas por defecto" />
                                    </MenuItem>
                                    {this.state.allColumns.map((column, index) => (
                                        <MenuItem key={index} value={column.field}>
                                            <Checkbox color="primary" checked={column.selected} />
                                            <ListItemText primary={column.headerName} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Select style={{ width: 130 }}
                                    value={this.state.pageSize}
                                    id="page-size"
                                    key="page-size"
                                    onChange={(event) => this.onPageSizeChanged(event, this)}
                                    className="mx-3"
                                    name="cant">
                                    <MenuItem value={10}>10 filas</MenuItem>
                                    <MenuItem value={20}>20 filas</MenuItem>
                                    <MenuItem value={30}>30 filas</MenuItem>
                                    <MenuItem value={100}>100 filas</MenuItem>
                                </Select>

                            </div>
                        </div>
                    </Col>
                </Row>
                <Row style={{
                    borderLeft: '#E0E0E0 solid 2px',
                    borderRight: '#E0E0E0 solid 1.5px',
                    borderBottom: '#E0E0E0 solid 1.5px'
                }}>
                    <Col className="p-0" style={styles.col} style={{ width: "100%", height: "100%" }}>
                        <div className="ag-theme-material" id="myGrid" style={{
                            height: '100%',
                            width: '100%',
                            margin: '0px'
                        }}>
                            {this.props.data &&
                                <AgGridReact id="table-grid"
                                    columnDefs={this.state.columnDefs}
                                    context={this.state.context}
                                    frameworkComponents={this.state.frameworkComponents}
                                    rowData={this.props.data}
                                    enableSorting={true}
                                    enableFilter={false}
                                    floatingFilter={true}
                                    enableColResize={true}
                                    showToolPanel={true}
                                    pagination={true}
                                    paginationPageSize={this.state.pageSize}
                                    rowGroupPanelShow={this.state.rowGroupPanelShow}
                                    enableStatusBar={true}
                                    localeText={this.state.localeText}
                                    onGridReady={this.onGridReady.bind(this)}
                                    rowSelection={this.state.rowSelection}
                                    onSelectionChanged={this.onSelectionChanged.bind(this)}
                                    onGridSizeChanged={this.onGridSizeChanged.bind(this)}>
                                </AgGridReact>
                            }
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col style={{ textAlign: "end" }}>
                        <Button style={{ margin: 8 }} color="primary" onClick={this.onBtExport.bind(this)} > Exportar a CSV </Button>
                    </Col>
                </Row>
            </CardBody>
        );
    }
}
const mapStateToProps = state => ({
    datosBrutos: state.trabajos.estructuraDocumentalTrabajo ? state.trabajos.estructuraDocumentalTrabajo : '',
    tablePersonalization: state.expedientes.tablePersonalization,
    columnDefs: state.expedientes.tablePersonalization.columnDefs
});


export default withRouter(connect(mapStateToProps, {
    gotrabajos, setSelectedExpedienteTo, fetchExpedienteDatosGeneral,
    fetchExpedienteTrabajos, fetchEstructuraDocumentalTrabajo, dispatchTablePersonalization
})(withStyles(styles)(TramitacionesCurso)));