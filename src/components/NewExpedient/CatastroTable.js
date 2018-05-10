import React, { Component } from 'react'

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';

const propTypes = {
    data: PropTypes.array,
}
class TablaCatastro extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {headerName: "Calle/Lugar", field: "Calle", width: 120},
                {headerName: "Nº", field: "Numero", width: 100},
                {headerName: "Piso", field: "Piso", width: 70},
                {headerName: "CP", field: "Codigo_Postal", width: 100},
                {headerName: "Municipio", field: "Concello", width: 100}
            ],
            rowData: [
                {Calle: "Aragón", Numero: "", Piso: 3, Codigo_Postal: 36202, Concello: "Vigo"}
            ],
            ubicacion: [{Calle: "", Numero: "", Piso: "", Codigo_Postal: "", Concello: ""}],
        }
    }


    render() {
        return (
                <div 
                  className="ag-theme-balham"
                  style={{ 
	                height: '125px', 
                    width: '492px' ,
                    margin: '20px 0 20px 0'}} 
		            >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.props.data}>
                    </AgGridReact>
                </div>
            );
    }
}
TablaCatastro.propTypes = propTypes;
export default TablaCatastro;