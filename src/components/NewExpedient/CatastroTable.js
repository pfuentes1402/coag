import React, { Component } from 'react'
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';
import  { elimardelatabla } from './../../actions/expedientes/index'

const propTypes = {
    data: PropTypes.array,
}
class TablaCatastro extends Component {
    constructor(props) {
        super(props);
         this.getContextMenuItems = this.getContextMenuItems.bind(this);
          //this.onButtonClick = this.onButtonClick.bind(this);

        this.state = {
            columnDefs: [
                {headerName: "Calle/Lugar",field: "Calle",checkboxSelection: true, width: 150 },
                {headerName: "Nº", field: "Numero", width: 50},
                {headerName: "Piso", field: "Piso", width: 60},
                {headerName: "CP", field: "Codigo_Postal", width: 70},
                {headerName: "Municipio", field: "Concello", width: 155}
            ],
            rowData: [
                {Calle: "Aragón", Numero: "", Piso: 3, Codigo_Postal: 36202, Concello: "Vigo"}
            ],
            ubicacion: [{Calle: "", Numero: "", Piso: "", Codigo_Postal: "", Concello: ""}],
        }
    }
   getContextMenuItems = (params) => {
       if (!params.node) return [];
       let filePath = params.node.data ? params.node.data.Calle : [];

       let deleteItem = {
           name: "Delete",
           action: () => this.props.actions.deleteFiles(filePath)
       };

       let newItem = {
           name: "New",
           action: () => console.log('new')
       };

       return params.node.data.Calle ? [deleteItem] : [newItem, deleteItem];
   };
   onButtonClick = e => {
       const selectedNodes = this.gridApi.getSelectedNodes()
            
       const selectedData = selectedNodes.map(node => node.data)
       
        console.log(selectedNodes)
       const selectedDataStringPresentation = selectedNodes.map(node => node.id ).join(', ')
       console.log(selectedDataStringPresentation);
       this.props.elimardelatabla(selectedDataStringPresentation)
       
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
                                        rowData={this.props.addressreducida}                                         
                                         enableSorting = {true}
                                         enableFilter = {true}
                                         rowSelection = "multiple"
                                         onGridReady = {
                                             params => this.gridApi = params.api
                                         }
                                        >
                                        
                                    </AgGridReact>
                                    < button onClick = {
                                        this.onButtonClick
                                    } > Get selected rows </button>
            
                </div>
            );
    }
}

const mapStateToProps = state => ({
    direcciones:state.expedientes.adressValidated,
    addressreducida:state.expedientes.addressreducida || [],
  });

const mapDispatchToProps =state =>({
    elimardelatabla,
});

export default connect(mapStateToProps, mapDispatchToProps)(TablaCatastro);