import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

/*class ExpedienteLevel extends Component {
    render() {
        return (
            <div className="arbol">  
            <p>{this.props.expediente}</p>
        </div>
        );
    }
}*/

const ExpedienteLevel = ({OnhandleClickLateral,expediente})=>(
    <div  onClick={OnhandleClickLateral}>
         <div className='bloque'>
         <p>{expediente}</p>
         </div>
            
    </div>
)

ExpedienteLevel.propTypes = {

};

export default ExpedienteLevel;

