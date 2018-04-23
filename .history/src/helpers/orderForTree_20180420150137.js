

export default  function orderForTree(arrReduc) {
    
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;

    // First map the nodes of the array to an object -> create a hash table.
    for(var i = 0, len = arrReduc.length; i < len; i++) {
        arrElem = arrReduc[i];
        mappedArr[arrElem.id_estructura] = arrElem;
        mappedArr[arrElem.id_estructura]['children'] = [];
    }


    for (var id_estructura in mappedArr) {
        if (mappedArr.hasOwnProperty(id_estructura)) {
            mappedElem = mappedArr[id_estructura];
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem.id_estructura_padre) {
                mappedArr[mappedElem['id_estructura_padre']]['children'].push(mappedElem);
            }
            // If the element is at the root level, add it to first level elements array.
            else {
                tree.push(mappedElem);
            }
        }
    }
    
    return tree;
    
}



    