import React, {Component} from 'react';
import {Row, Col} from 'reactstrap';
import {withStyles} from '@material-ui/core/styles';
import {List, ListItem, Typography, Divider} from '@material-ui/core';
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


const styles = theme => ({
   borderBottom: {
       borderBottom: "solid 1px rgba(0, 0, 0, 0.12)"
   }
});

class AccionesExistentes extends Component { 
    constructor(props) {
        super(props);
        this.props.addTranslation(AccionesTranslations);
      }

      handleClick(accion){
          this.props.fetchIdAccion(accion.Id);
          this.props.fetchMuestraModal(accion.Id);
          this.props.fetchCambiaStatoModalAcciones();
      }

    render() {
        let {classes} = this.props;
        return (
            <div>
            <Row>
                <Col>
                    <List component="nav"
                    subheader={<Typography variant="h6" gutterBottom className="px-4 pt-4 pb-3" style={{fontSize: 18}}>
                                <Translate id="Actions.title"/>
                            </Typography>}>
                        <Divider/>
                        {
                            acciones.map((accion,i) => (
                                <ListItem key={i} onClick={() => {this.handleClick(accion)}} button className={classes.borderBottom}>
                                    <Typography variant="button" gutterBottom color="primary" className="mb-1 mt-1">
                                        {this.props.translate(`Actions.listactions.action${i}`)}
                                    </Typography>
                                    <Divider/>
                                </ListItem>
                            ))
                        }
                    </List>
                </Col>
            </Row>
            </div>

        );
    }
}


const mapStateToProps = state => ({
  
  });
export default connect(mapStateToProps,{ fetchMuestraModal, fetchIdAccion, fetchCambiaStatoModalAcciones })(withLocalize(withStyles(styles)(AccionesExistentes)))



