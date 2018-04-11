import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AgGridReact} from 'ag-grid-react';


class Componentgrip extends Component {

    constructor() {
        super();

        this.state = {
            gridOptions = {
                columnDefs: [
                    {make: "Toyota", model: "Celica", price: 35000},
                    {make: "Ford", model: "Mondeo", price: 32000},
                    {make: "Porsche", model: "Boxter", price: 72000}
                ]
            }
        }
    }


    render() {

        return (

            // Grid Definition
            <AgGridReact
                // listening for events
                onGridReady={this.onGridReady}

                // binding to array properties
                rowData={this.state.rowData}

                // no binding, just providing hard coded strings for the properties
                // boolean properties will default to true if provided (ie enableColResize => enableColResize="true")
                rowSelection="multiple"
                enableColResize

                // setting grid wide date component
                dateComponentFramework={DateComponent}
                gridOptions={this.state.gridOptions}

                // setting default column properties
                defaultColDef={{
                    headerComponentFramework: SortableHeaderComponent,
                    headerComponentParams: {
                        menuIcon: 'fa-bars'
                    }

                }}>

                // column definitions
                <AgGridColumn field="make"></AgGridColumn>
                <AgGridColumn field="model"></AgGridColumn>
                <AgGridColumn field="price"></AgGridColumn>
            </AgGridReact>
        );
    }
}

Componentgrip.propTypes = {
    dummy: PropTypes.string.isRequired,
};

export default Componentgrip;
