import React, { Component } from 'react'
import {CardBody} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';
import "./ListWorks.css";

const propTypes = {
    data: PropTypes.array,
}
class TablaTrabajos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {headerName: "Nº", field: "numero", width: 55},                
                {headerName: "TITULO TRABAJO", field: "Titulo", width: 140},
                {headerName: "ESTADO", field: "estado", width: 110},
                {headerName: "F.ENTRADA", field: "fecha_entrada", width: 100},
                {headerName: "F.VIASADO", field: "fecha_visado", width: 100},
                {headerName: "INC", field: "inc", width: 60},             
            ],
            rowData: [
                {numero: "Aragón", Titulo: "", estado: 3, fecha_entrada: 36202, fecha_visado: "Vigo", inc: ""}
            ],
            trabajo:[
                {numero: "", Titulo: "", estado: "", fecha_entrada:"", fecha_visado: "", inc: ""}
            ],
        }
    }


    render() {
        return (
            <CardBody  className="card-body-Trabajos">
                <div 
                  className="ag-theme-balham"
                  style={{ 
	                height: '125px', 
                    width: '570px' ,
                    margin: '20px 0 20px 0'}} 
		            >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.props.data}>
                    </AgGridReact>
                </div>
                </CardBody>
            );
    }
}
TablaTrabajos.propTypes = propTypes;

export default TablaTrabajos;