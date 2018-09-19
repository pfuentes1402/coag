 
    


export default function estructurahelper(temp){    

    console.log('titulo')
    console.log(temp)
    var carpetas=[];
    temp.EstructuraDocumental.forEach(element => {
        if(element.Id_Tipo_Estructura==1){
            carpetas.push(element.Titulo)
        }
    });
    console.log({carpetas});
}


              
    
