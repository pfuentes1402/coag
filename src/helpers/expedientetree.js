import orderForTree from "./orderForTree";

export default function expedientetree(temp){    

    let arrReduc = temp;
   
                var i;
                for(i = 0; i < arrReduc.length; i++){
                    arrReduc[i].name = arrReduc[i]['titulo'];
                    
                    delete arrReduc[i].titulo;
                }
               
                 let tree = orderForTree(arrReduc);
                
                return arrReduc
            }
