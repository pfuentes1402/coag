import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ExpedienteLevel from './ExpedienteLevel';



/*class Componentelateral extends Component {
    


    componentDidMount(){
        console.log("Componente Lateral Did Mount");
       // console.log(this.props.trabajos[0]);
    }
    componentWillMount(){
        console.log("Componente Lateral WillMount");
        //console.log(this.props.trabajos[0]);
    }
    componentDidUpdate(){
        console.log("Componente Did Update");      
        console.log(this.props.trabajos[0]);
    }
      

    render() {  

        console.log("Componente Lateral render");
        //console.log(this.props.trabajos[0]);
      
        
        return (
          <div>{PruebaArbol}</div>
        );
    }
}*/


const Componentelateral = ({trabajos, onSelectedLevel})=>{
    const handleClickLateral = trabajo =>{
        console.log("Clic desde ---------------Componente Lateral");
        console.log(trabajo);
        onSelectedLevel(trabajo);
    };

    const strToComponent = trabajos =>(
        trabajos.map(trabajo =>
        (
            <ExpedienteLevel
                key={trabajo.key}
                expediente={trabajo.Titulo}
                OnhandleClickLateral={()=>handleClickLateral(trabajo)}
            />))
    );

return (<div>
        {strToComponent(trabajos)}
        </div>);
};



const mapStateToProps = state => ({
    expedientes: state.expedientes.datosTrabajo,    
   
  });



export default connect(mapStateToProps,)(Componentelateral);
