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
                {headerName: "NIF", field: "nif", width: 100},                
                {headerName: "NOMBRE", field: "nombre", width: 180},
                {headerName: "%", field: "porcentage", width: 60},
                          
            ],
            rowData: [
                {nif: "76900827M", nombre: "Manuel", porcentage: '30%'}
            ],
            trabajo:[
                {nif: "", nombre: "", porcentage: ""}
            ],
        }
    }


    render() {
        return (
            <CardBody  className="card-body-Trabajos">
            <CardText>

                <div 
                  className="ag-theme-balham"
                  style={{ 
	                height: '125px', 
                    width: '500px' ,
                    margin: '20px 26px 20px 26px'}} 
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