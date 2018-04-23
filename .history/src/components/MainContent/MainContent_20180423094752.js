import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import './styles.css';
import TreeDocuments from "../TreeDocuments/TreeDocuments";
import {fetchExpedientes} from '../../actions/expedientes'
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';


var arrReduc=[];

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

class MainContent extends Component {
    /*constructor(props) {
        super(props);

        this.state = {
            tree: [],
        };
    }*/

    componentDidMount(){
    /*    fetch('http://servicios.coag.es/api/EstructuraDocumental/688685/2')
            .then((response) => {
                return response.json();
            })
            .then((temp) => {
                 arrReduc = temp.EstructuraDocumental;
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
                this.setState({ tree: tree })
            });*/
            this.props.fetchExpedientes();
    }



    render() {
        return (
            <div>
                <Container className="full">
                    <Row className="principal">
                    <Col xs="6" sm="3">
                        <TreeDocuments data={this.state.tree}/>
                    </Col>
                    <Col xs="6" sm="9">
                       <div className='divizquierda'></div>
                    </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

MainContent.propTypes = {};

MainContent.defaultProps = {
    tree: [],
    loading: false,
  };
const mapStateToProps = state => ({
    tree: state.expedientes.data,
   
  });

export default connect(mapStateToProps,{fetchExpedientes})(MainContent);
