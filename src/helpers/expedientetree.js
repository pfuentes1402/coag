import orderForTree from "./orderForTree";

export default function expedientetree(temp){
    console.log('llega expedientetree');
    console.log(temp);

    let arrReduc = temp;
    console.log(arrReduc);
                var i;
                for(i = 0; i < arrReduc.length; i++){
                    arrReduc[i].name = arrReduc[i]['titulo'];
                    
                    delete arrReduc[i].titulo;
                }
                console.log("Fijate");
                console.log(arrReduc);
                 let tree = orderForTree(arrReduc);
                
                return arrReduc
            }
