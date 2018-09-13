import React, { Component } from 'react'
import {CardBody, CardText} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {  Button} from 'reactstrap';
import { buttonAdd } from './../../../actions/interfaz/index'
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

    getContextMenuItems = (params) => {
        if (!params.node) return [];
        let filePath = params.node.data ? params.node.data.filePath : [];
    
        let deleteItem = {
            name: "Delete",
            action: () => this.props.actions.deleteFiles(filePath)
        };
    
        let newItem = {
            name: "New",
            action: () => this.props.actions.newFile(filePath)
        };
    
        return params.node.data.file ? [deleteItem] : [newItem, deleteItem];
    };

    render() {
        console.log('antes de pulsar');
        console.log(this.props.titulo);
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
                        rowData={this.props.data}
                        autoGroupColumnDef={this.autoGroupColumnDef}
                        getContextMenuItems={this.getContextMenuItems}
           
                        >
                    </AgGridReact>
                </div>
                </CardText>
               
                {/* <Button onClick={() => { this.props.buttonAdd(this.props.titulo) }}>+</Button> */}
                
                </CardBody>
            );
    }
}
AgentsTable.propTypes = propTypes;


const mapStateToProps = state => ({    
   
  });

export default connect(mapStateToProps, { buttonAdd } )(AgentsTable);