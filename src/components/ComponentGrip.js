import React, { Component } from 'react'

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';

const propTypes = {
    data: PropTypes.array,
}
class ComponentGrip extends Component {
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
            ubicacion: '',
            response: '',
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.data != this.props.data && this.props.data.length!=0){
            this.forceUpdate()
            console.log(this.state.ubicacion);
            return true;
        } 
        else return false; 
    }
    componentDidUpdate(){
            var response = this.props.data[0];
            this.setState({
                ubicacion: [
                    {calle: response.Calle, numero: response.Numero,
                        piso: response.Planta, cp: response.Codigo_Postal, municipio: response.ID_Municipio}
                ]
            });
            console.log(this.state.ubicacion);
    }

    render() {
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
                        rowData={this.state.rowData}>
                    </AgGridReact>
                </div>
            );
    }
}
ComponentGrip.propTypes = propTypes;
export default ComponentGrip;