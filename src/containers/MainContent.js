import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MenuAppBar from './../components/MenuAppBar';
import subBar from '../components/SubBar';
import {withStyles} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import './styles.css';
import TreeDocuments from "../components/TreeDocuments";

function orderForTree(arrReduc) {

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



var arrReduc=[];



class MainContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tree: [],
        };
    }

    componentDidMount(){
        fetch('http://servicios.coag.es/api/EstructuraDocumental/702181/2')
            .then((response) => {
                return response.json();
            })
            .then((temp) => {
                 arrReduc = temp[0].ds.EstructuraDocumental;
                var i;
                for(i = 0; i < arrReduc.length; i++){
                    arrReduc[i].name = arrReduc[i]['titulo'];
                    // if(arrReduc[i]['children'].length === 0){
                    //     delete arrReduc[i].children;
                    // }
                    delete arrReduc[i].titulo;
                }

                 let tree = orderForTree(arrReduc);
                this.setState({ tree: tree })
            });
    }



    render() {
        return (
            <div>
                <Grid container spacing={24}>

                    <Grid item xs={6} sm={3}>
                        <TreeDocuments data={this.state.tree}/>
                    </Grid>
                    <Grid item xs={6} sm={9}>
                       <div className='divizquierda'></div>
                    </Grid>

                </Grid>
            </div>
        );
    }
}

MainContent.propTypes = {};

export default MainContent;
