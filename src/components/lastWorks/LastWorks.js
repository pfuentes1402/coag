import React from "react";
import { render } from "react-dom";
import { makeData, Logo, Tips } from "./Utils";

// Import React Table
import ReactTable from "react-table";
//import "react-table/react-table.css";
import './react-table.css';


const datab=
    [{"codEstudio":"REFLAXE","expTitle":"Reforma Zara A Laxe","workTitle":"Proyecto de ejecucion","local":"SANTIAGO DE COMPOSTELA","status":"Postentrega","actions":""},
    {"codEstudio":"VIVESP","expTitle":"Vivienda en burgos","workTitle":"Proyecto básico","local":"SANTIAGO DE COMPOSTELA","status":"Entregado","actions":""},
    {"codEstudio":"VIVESP","expTitle":"Reforma Zara A Laxe","workTitle":"oficio de dirección","local":"SANTIAGO DE COMPOSTELA","status":"Postentrega","actions":""},
    {"codEstudio":"VIVESP","expTitle":"Vivienda en zamora","workTitle":"Proyecto de ejecucion","local":"SANTIAGO DE COMPOSTELA","status":"Postentrega","actions":""},
    {"codEstudio":"HOSPRB","expTitle":"Hospital Rosa Blanca","workTitle":"Proyecto de ejecucion","local":"SANTIAGO DE COMPOSTELA","status":"Entregado","actions":""},
    {"codEstudio":"OFICMAL","expTitle":"Reforma Zara A Laxe","workTitle":"Proyecto de ejecucion","local":"SANTIAGO DE COMPOSTELA","status":"Postentrega","actions":""}]




class LastWorks extends React.Component {
  constructor() {
    super();
    this.state = {
      data: makeData()
    };
  }
  render() {
    
    const { data } = this.state;
    return (
      <div>
        <ReactTable
          //data={datab}
          data={this.props.data}
          columns={[
            {
             
              columns: [
                {
                  Header: "COD ESTUDIO",
                  accessor: "id_Expediente",
                 
                },
                {
                  Header: "TITULO EXPEDIENTE",
                  accessor: "expTitle"
                 
                }
              ]
            },
            {             
              columns: [
                {
                  Header: "TITULO TRABAJO",
                  accessor: "name",
                  sortMethod: (a, b) => {
                    if (a.length === b.length) {
                      return a > b ? 1 : -1;
                    }
                    return a.length > b.length ? 1 : -1;
                  }
                },
                {
                  Header: "MUNICIPIO",
                  accessor: "local"
                }
              ]
            },
            {             
              columns: [
                {
                  Header: "ESTADO",
                  accessor: "Estado"
                }
              ]
            },
            {             
              columns: [
                {
                  Header: "ACCIONES",
                  accessor: "actions"
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        <br />
       
      </div>
    );
  }
}


export default LastWorks;