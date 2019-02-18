import React, {Component} from 'react';
import {Row, Col, ListGroup, ListGroupItem} from 'reactstrap';
import { connect } from 'react-redux';
import { fetchMuestraModal, fetchCambiaStatoModalAcciones } from './../../actions/interfaz/index'
import { fetchIdAccion } from './../../actions/usuarios/index'
import { withLocalize, Translate } from 'react-localize-redux';
import AccionesTranslations from './../../traducciones/Actions.json';

import './styles.css';

const acciones =[
    {Id:1,nombre:'Modificar datos expediente'},
    {Id:2,nombre:'Tramitar nuevo trabajo'},
    {Id:3,nombre:'Solicitar Loa(libro de órdenes y asistencias)'},
    {Id:4,nombre:'Solicitar Li(libro de incidencias)'},
    {Id:5,nombre:'convertir a digital expediente papel'},
    {Id:6,nombre:'cesar/cerrar expediente'}
];

function RenderAccion(acciones, props) {
    const click = (accion)=>{
        props.fetchIdAccion(accion.Id);
        props.fetchMuestraModal(accion.Id);
        props.fetchCambiaStatoModalAcciones();
    }
    return <Translate>
        {({translate})=>
            acciones.map((accion,i) =>(
                <ListGroupItem key={i} onClick={()=>click(accion)}>
                        <text style={{cursor: "pointer"}} className="text-primary">{translate(`Actions.listactions.action${i}`).toUpperCase()}</text>
                </ListGroupItem>
            ))}
    </Translate>
}
const styles = ({
    title: {
        fontWeight: 600,
        padding: "16px 8px 0px 16px"
    },
    col: {
        padding: 0
    },

});
class AccionesExistentes extends Component { 
    constructor(props) {
        super(props);
        this.props.addTranslation(AccionesTranslations);
      }

    render() {
        return (
            <div>
            <Row>
                <Col>
                    <label style={styles.title}><Translate id="Actions.title"/></label>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListGroup>
                        {RenderAccion(acciones, this.props)}
                    </ListGroup>
                </Col>
            </Row>
            </div>

        );
    }
}




const mapStateToProps = state => ({
  
  });


  
  

export default connect(mapStateToProps,{ fetchMuestraModal, fetchIdAccion, fetchCambiaStatoModalAcciones })(withLocalize(AccionesExistentes));


