import React, { Component } from 'react'
import ReactDOM, {render} from 'react-dom';
import { connect } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';
import  { elimardelatabla } from './../../actions/expedientes/index'
const rootDiv = document.getElementById('root');

const propTypes = {
    data: PropTypes.array,
}



class TablaCatastro extends Component {
    constructor(props) {
        super(props);
         //this.getContextMenuItems = this.getContextMenuItems.bind(this);
          //this.onButtonClick = this.onButtonClick.bind(this);

        this.state = {
            columnDefs: [
                {headerName: "Calle/Lugar",field: "Calle",checkboxSelection: true, width: 150 },
                {headerName: "Nº", field: "Numero", width: 50},
                {headerName: "Piso", field: "Piso", width: 60},
                {headerName: "CP", field: "Codigo_Postal", width: 70},
                {headerName: "Municipio", field: "municipio", width: 155}
            ],
            rowData: [
                {Calle: "Aragón", Numero: "", Piso: 3, Codigo_Postal: 36202, Concello: "Vigo"}
            ],
            ubicacion: this.props.data,
        }
    }
  
   onButtonClick = e => {
       e.preventDefault()
       const selectedNodes = this.gridApi.getSelectedNodes()
            
       const selectedData = selectedNodes.map(node => node.data.Calle)
       const refcatastrals = selectedNodes.map(node => node.data.refcatastral).join(', ')
       
       
       const selectedDataStringPresentation = selectedNodes.map(node => node.id ).join(', ')
      
       this.props.elimardelatabla(selectedDataStringPresentation,refcatastrals)
       var params = { force:true };
              
       
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
                                        rowData={this.props.data}                                         
                                         enableSorting = {true}
                                         enableFilter = {true}
                                         enableCellChangeFlash={true}
                                         rowSelection = "multiple"

                                       
                                        
                                        autoGroupColumnDef={this.autoGroupColumnDef}
                                        groupDefaultExpanded={-1}
                                        onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                                        getContextMenuItems={this.getContextMenuItems}

                                        
                                         onGridReady = {
                                             params => this.gridApi = params.api
                                         }
                                        >
                                        
                                    </AgGridReact>
                                    <button onClick = {this.onButtonClick}> Eliminar seleccionadas </button>
            
                </div>
            );
    }
}

const mapStateToProps = state => ({
    //catastros: state.expedientes.addressreducida,
    //direcciones:state.expedientes.adressValidated,
    //addressreducida:state.expedientes.addressreducida || [],
  });

// const mapDispatchToProps =state =>({
//     elimardelatabla,
// });

export default connect(mapStateToProps, {elimardelatabla})(TablaCatastro);