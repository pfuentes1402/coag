import React, { Component } from 'react'

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';

const propTypes = {
    data: PropTypes.string.isRequired,
}
class ComponentGrip extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {headerName: "Calle/Lugar", field: "calle"},
                {headerName: "Nº", field: "numero"},
                {headerName: "Piso", field: "piso"},
                {headerName: "CP", field: "cp"},
                {headerName: "Municipio", field: "municipio"}
            ],
            rowData: [
                {calle: "Toyota", numero: "Celica", piso: 3, cp: 36208, municipio: "Vigo"}
            ],
            ubicacion: '',
            response: '',
        }
    }
    componentDidUpdate(){
        console.log("actualiza");

    }

    render() {
        return (
                <div 
                  className="ag-theme-balham"
                  style={{ 
	                height: '300px', 
	                width: '900px' }} 
		            >
                    <div>{this.props.data}</div>
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}>
                    </AgGridReact>
                </div>
            );
    }
}
ComponentGrip.propTypes = propTypes;
export default ComponentGrip;