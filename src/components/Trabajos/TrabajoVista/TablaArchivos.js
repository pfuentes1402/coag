import React, { Component } from 'react'
import {ListGroupItem} from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import PropTypes from 'prop-types';
import "./styles.css";

const propTypes = {
    data: PropTypes.array,
}
class TablaArchivos extends Component {
  
  
    render() {


        const renderFiles = files =>(
            
                    files.map((file,i) =>(
                   
                    <ListGroupItem className="file" key={i} >
                        <span>{file.nombre}</span><span>{file.carpeta}</span><span>{file.firma}</span>                       
                    </ListGroupItem>  
                ))
           
            );

        var files =[
            {Id:0,nombre:'Memoria descriptiva.pdf', carpeta:'Memoria descriptiva',firma:'true'},
            {Id:1,nombre:'Memoria urbanistica.pdf', carpeta:'Memoria urbanistica',firma:'true'},
            {Id:2,nombre:'Memoria constructiva.pdf', carpeta:'Memoria constructiva',firma:'true'},
            {Id:3,nombre:'Estudio geotecnico.pdf', carpeta:'Estudio geotecnico',firma:'false'},
         ]
    
        return (
            <div>
                {renderFiles(files)}
            </div>
            );
    }
}


export default TablaArchivos;