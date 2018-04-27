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
                {headerName: "Calle/Lugar", field: "calle", width: 120},
                {headerName: "Nº", field: "numero", width: 100},
                {headerName: "Piso", field: "piso", width: 70},
                {headerName: "CP", field: "cp", width: 100},
                {headerName: "Municipio", field: "municipio", width: 100}
            ],
            rowData: [
                {calle: "Aragón", numero: "", piso: 3, cp: 36202, municipio: "Vigo"}
            ],
            ubicacion: [{calle: "", numero: "", piso: "", cp: "", municipio: ""}],
        }
    }


    render() {

            var response = this.props.data;
            if(response.length === 0){
               var ubicacion=[];
            }else{
                console.log(response);
                 ubicacion = [
                    {calle: response[0].Calle, numero: response[1].Numero,
                        piso: response[2].Piso, cp: response[3].Codigo_Postal, municipio: response[4].Concello}
                ]     ;
            }



        return (
                <div 
                  className="ag-theme-balham"
                  style={{ 
	                height: '63px', 
                    width: '492px' ,
                    margin: '20px 0 20px 0'}} 
		            >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={ubicacion}>
                    </AgGridReact>
                </div>
            );
    }
}
TablaCatastro.propTypes = propTypes;
export default TablaCatastro;