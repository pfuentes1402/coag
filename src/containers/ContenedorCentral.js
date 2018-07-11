import React from 'react';

import './styles.css';   

import ContenedorExpedientes from './ContenedorExpedientes';
import ContenedorTrabajos from './ContenedorTrabajos';


const RenderContenedorcentralTrabajo =() =>{
    return (<ContenedorTrabajos/>)
}
const RenderContenedorExpediente =() =>{
    return (<ContenedorExpedientes/>)
}

const Contenedorcentral= ({contenidoExp}) =>(

    <div>
    {contenidoExp === "trabajos" ? RenderContenedorcentralTrabajo():RenderContenedorExpediente()}
   
    
    </div>
)





export default Contenedorcentral;