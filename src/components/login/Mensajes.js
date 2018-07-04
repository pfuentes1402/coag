import React from 'react';

import { connect } from 'react-redux';


import "./styles.css";

const Mensajes = (props) => {
   
    return (
        <div className="centrado">
            <h2>{props.mensaje}</h2>           
            
        </div>
    )
}



const mapStateToProps = state => ({
   
  });


const mapDispatchToProps = {
    
    
    
};


export default connect(mapStateToProps, mapDispatchToProps)(Mensajes);


