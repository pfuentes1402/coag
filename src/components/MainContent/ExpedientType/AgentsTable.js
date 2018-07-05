import React, { Component } from 'react'
import {CardBody, CardText} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';
import "./styles.css";

const propTypes = {
    data: PropTypes.array,
}
class AgentsTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                {headerName: "NIF", field: "Nif", width: 100},                
                {headerName: "NOMBRE", field: "Nombre", width: 310},
                {headerName: "%", field: "Porcentaje", width: 60},
                {headerName: "FUNCIÓN", field: "Funcion", width: 100},
                          
            ],
            rowData: [
                {nif: "76900827M", nombre: "Manuel", porcentage: '30%', Funcion:'DO'}
            ],
            trabajo:[
                {Nif: "", Nombre: "", Porcentaje: "", Funcion:""}
            ],
        }
    }


    render() {
        return (
            <CardBody  className="card-body-Trabajos">
            <CardText tag="div">

                <div 
                  className="ag-theme-balham"
                  style={{ 
	                height: '125px', 
                    width: '605px' ,
                    margin: '0'}} 
		            >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.props.data}>
                    </AgGridReact>
                </div>
                </CardText>
                </CardBody>
            );
    }
}
AgentsTable.propTypes = propTypes;

export default AgentsTable;