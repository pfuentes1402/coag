import React from 'react';
import Home from './../components/Home/Home';


import ContenedorExpedientes from './ContenedorExpedientes';
import ContenedorTrabajos from './ContenedorTrabajos';
import './styles.css';   


const RenderContenedorcentralTrabajo =() =>{
    return (<ContenedorTrabajos/>)
};
const RenderContenedorExpediente =() =>{
    return (<ContenedorExpedientes/>)
};
const RenderHome = () => {
    return ( <Home/> )
}

function renderizadoCondicional(contenidoExp) {
        switch (contenidoExp) {
            case 'trabajos':           
                return RenderContenedorcentralTrabajo();
            case 'expedientes':           
                return RenderContenedorExpediente();            
            default:
                return RenderHome();
    }
}

const Contenedorcentral= ({contenidoExp}) =>(

    <div>
        
    {/*contenidoExp === "trabajos" ? RenderContenedorcentralTrabajo():RenderContenedorExpediente()*/}  
    
        { renderizadoCondicional(contenidoExp) }
        {/* <Upload/> */}

     
   
    </div>
)







export default Contenedorcentral;