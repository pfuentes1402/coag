import orderForTree from "./orderForTree";

export default function ordertree(temp){
    console.log('llega');
    console.log(temp);

    let arrReduc = temp.EstructuraDocumental;
                var i;
                for(i = 0; i < arrReduc.length; i++){
                    arrReduc[i].name = arrReduc[i]['titulo'];
                    
                    delete arrReduc[i].titulo;
                }
                 let tree = orderForTree(arrReduc);

//TODO UNIFICAR EL ALGORITMO para más profundidad que 3 niveles
                 for(var i = 0; i < tree[0].children.length; i++){
                     var hijo = tree[0].children[i];
                     for(var j = 0; j < hijo.children.length; j++){
                        if(hijo.children[j].children.length == 0){
                            delete tree[0].children[i].children[j].children;
                        }else{
                            for(var k = 0; k < hijo.children[j].children.length; k++ ){
                                if(hijo.children[j].children[k].children){
                                    delete tree[0].children[i].children[j].children[k].children;
                                }
                            }
                        }
                     }
                 }
                
                return tree
            }
