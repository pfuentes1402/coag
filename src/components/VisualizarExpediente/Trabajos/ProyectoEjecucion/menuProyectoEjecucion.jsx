import React, { Component } from 'react';
import { List, ListItem, CircularProgress, ListItemText,  LinearProgress} from '@material-ui/core';
import {
  Divider, Collapse,  withStyles, ListItemIcon
} from '@material-ui/core';
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import { ExpandLess, ExpandMore, Close, Check, Block } from '@material-ui/icons';
import {red, green, orange} from '@material-ui/core/colors';

import '../../index.css'

const styles = theme => ({
  openOption: {
    background: theme.palette.primary.main,
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
        openEstructura: false
    }
  }


    handleClick(estructura) {
        this.setState(state=>({openEstructura: state.openEstructura === estructura ? -1 : estructura}));
    };


    render() {
    let { classes } = this.props;
    return (
      <div>
        <ListItem button className={this.props.active ? classes.openOption : ""}
          onClick={() => { this.props.changeOption(this.props.trabajo.Id_Trabajo)}}>
          <ListItemText primary={this.props.trabajo.Titulo} />
          {this.props.active ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Divider />
        <Collapse in={this.props.active} timeout="auto" unmountOnExit>
            {this.props.isLoadEstructura ?
                <LinearProgress className="m-3"/>
                : Object.keys(this.props.estructuraDocumental).map(estructura=>{
                    let estructuraPadre = this.props.estructurasPadre ? this.props.estructurasPadre.find(e => e.Titulo === estructura) : "";
                    return  <List component="div" disablePadding>
                        <ListItem button onClick={()=>{this.handleClick(estructura)}} className="pl-5" >

                            <ListItemText primary={estructura + ((estructuraPadre && estructuraPadre.Archivo_Requerido !== null && estructuraPadre.Archivo_Requerido === 1) ? ' *' : '')}/>
                            {this.state.openEstructura === estructura ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.openEstructura === estructura} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {this.props.estructuraDocumental[estructura].map((children,pos)=>{
                                    return <ListItem onDrop={()=>this.props.moveItemTo(children)}
                                                     className={this.props.dragTarget ? classes.dragTarget: ''} onDragOver={()=>{this.setState({drop:pos})}} button onClick={()=> { this.props.changeEstructura(children.Id_Estructura, children.Titulo)}}
                                                     style={children.Estado_Visual === 0 ? {color: red[500]} : (children.Estado_Visual === 1 ? {color: green[500]} : {color: orange[500]})}>
                                        <ListItemIcon style={{marginRight: 0, marginLeft: 24}} className={children.Estado_Visual === 0 ? classes.red : (children.Estado_Visual === 1 && classes.green )}>
                                            {children.Estado_Visual === 0 ? <Close/> : (children.Estado_Visual === 1 ? <Check/> : <Block/>) }
                                        </ListItemIcon>
                                        <ListItemText inset primary={children.Titulo + (children.Archivo_Requerido !== null && children.Archivo_Requerido === 1 ? ' *' : '')} classes={{primary: children.Estado_Visual === 0 ? classes.red : (children.Estado_Visual === 1 && classes.green )} }/>
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