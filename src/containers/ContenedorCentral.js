import React from 'react';
import Home from './../components/Home/Home';
import './styles.css';   

import ContenedorExpedientes from './ContenedorExpedientes';
import ContenedorTrabajos from './ContenedorTrabajos';


const RenderContenedorcentralTrabajo =() =>{
    return (<ContenedorTrabajos/>)
}
const RenderContenedorExpediente =() =>{
    return (<ContenedorExpedientes/>)
}
const RenderHome = () => {
    return ( <Home/> )
}

function renderizadoCondicional(contenidoExp) {
        switch (contenidoExp) {
            case 'trabajos':
                return RenderContenedorcentralTrabajo();
            case 'expediente':
                return RenderContenedorExpediente();
            
            default:
                return RenderHome();
    }
}

const Contenedorcentral= ({contenidoExp}) =>(

    <div>
        
    {/*contenidoExp === "trabajos" ? RenderContenedorcentralTrabajo():RenderContenedorExpediente()*/}  
    {
        renderizadoCondicional(contenidoExp)
    }
    
    </div>
)







export default Contenedorcentral;