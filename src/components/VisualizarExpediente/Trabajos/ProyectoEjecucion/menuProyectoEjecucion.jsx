import React, { Component } from 'react';
import { List, ListItem, ListItemText,  LinearProgress} from '@material-ui/core';
import {
  Divider, Collapse,  withStyles, ListItemIcon
} from '@material-ui/core';
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import { ExpandLess, ExpandMore, Close, Check, Block } from '@material-ui/icons';
import {red, green, orange} from '@material-ui/core/colors';
import classNames from 'classnames';

import '../../index.css'

const styles = theme => ({
  openOption: {
    background: theme.palette.primary.main,
    color: "white"
  },
    textWhite: {
        color: "white"
    },
    dragTarget: {
            border:'solid 1px #b26a00',
            borderRadius:5
    },
    red: {
      color: red[500],

    },
    green: {
      color: green[500]
    },
    orange: {
      color: orange[500]
    }
});

class MenuProyectoEjecucion extends Component {
  constructor(props) {
    super(props);
    this.state = {
        openExcecutionMenu: this.props.active,
        openEstructura: false,
        estructurasAbiertas:[]
    }
  }


    handleClick(idEstructura) {

        let newIdEstructura=this.state.estructurasAbiertas;
        let pos= this.state.estructurasAbiertas.indexOf(idEstructura)
        if (pos===-1){
            newIdEstructura.push(idEstructura)
        }else{
            newIdEstructura.splice(pos,1)
        }
        this.setState(state=>({estructurasAbiertas:newIdEstructura,openEstructura: state.openEstructura === idEstructura ? -1 : idEstructura}));
    };


    render() {
    let { classes } = this.props;
    return (
      <div>
        <ListItem button className={this.props.active ? classes.openOption : ""}
          onClick={() => { this.props.changeOption(this.props.trabajo.Id_Trabajo)}}>
          <ListItemText primary={this.props.trabajo.Titulo} classes={{primary: this.props.active ? classes.textWhite : ""}}/>
          {this.props.active ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Divider />
        <Collapse in={this.props.active} timeout="auto" unmountOnExit>
            {this.props.isLoadEstructura ?
                <LinearProgress className="m-3"/>
                : Object.keys(this.props.estructuraDocumental).map((estructura,position)=>{
                    let estructuraPadre = this.props.estructurasPadre ? this.props.estructurasPadre.find(e => e.Titulo === estructura) : "";
                    return  <List key={'menu-'+position} component="div" disablePadding>
                        <ListItem button onClick={()=>{this.handleClick(estructura)}} className="pl-5" >

                            <ListItemText primary={estructura + ((estructuraPadre && estructuraPadre.Archivo_Requerido !== null && estructuraPadre.Archivo_Requerido == 1) ? ' *' : '')}/>
                            {this.state.estructurasAbiertas.indexOf(estructura) !=-1? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.estructurasAbiertas.indexOf(estructura) !=-1} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {this.props.estructuraDocumental[estructura].map((children,pos)=>{
                                    return <ListItem key={'menu-item'+pos} onDrop={async ()=>{
                                                        let response = await this.props.moveItemTo(children)
                                                        if (response)
                                                            this.props.changeEstructura(children.Id_Estructura, children.Titulo, children)
                                                    }}
                                                     style={{paddingLeft: 48}}
                                                     className={classNames((this.props.dragTarget ? classes.dragTarget: ''),
                                                         (children.Id_Estructura === this.props.idEstructuraActiva ? classes.openOption : ""))}
                                                     onDragOver={()=>{this.setState({drop:pos})}} button
                                                     onClick={()=> { this.props.changeEstructura(children.Id_Estructura, children.Titulo, children)}}
                                                     >
                                        <ListItemIcon style={{marginRight: 0, marginLeft: 24}}
                                                      className={children.Estado_Visual === 0 ? classes.red : (children.Estado_Visual === 1 && classes.green )}>
                                            {children.Estado_Visual === 0 ? <Close/> : (children.Estado_Visual === 1 ? <Check/> : <Block/>) }
                                        </ListItemIcon>
                                        <ListItemText inset primary={children.Titulo + (children.Archivo_Requerido !== null && children.Archivo_Requerido == 1 ? ' *' : '')}
                                                      classes={{primary: children.Id_Estructura === this.props.idEstructuraActiva ? classes.textWhite : ( children.Estado_Visual === 0 ? classes.red : (children.Estado_Visual === 1 && classes.green ))}}
                                                      />
                                    </ListItem>
                                })}

                            </List>
                        </Collapse>
                    </List>
                })}
        </Collapse>
        <Divider/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(MenuProyectoEjecucion)));