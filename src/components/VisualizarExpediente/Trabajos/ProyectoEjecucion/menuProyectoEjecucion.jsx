import React, { Component } from 'react';
import { List, ListItem, ListItemText, LinearProgress } from '@material-ui/core';
import {
  Divider, Collapse, withStyles, ListItemIcon
} from '@material-ui/core';
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import { ExpandLess, ExpandMore, Close, Check, Block } from '@material-ui/icons';
import { red, green, orange } from '@material-ui/core/colors';
import classNames from 'classnames';

import '../../index.css'

const styles = theme => ({
  openOption: {
    background: theme.palette.primary.main,
    color: "white"
  },
  textWhite: {
    color: "white",
    fontSize: 14,

  },
  textWhite13: {
    color: "white",
    fontSize: 13,

  },
  font13: {
    fontSize: 13,

  },
  font14: {
    fontSize: 14,
  },
  font12: {
    fontSize: 12,
  },
  dragTarget: {
    border: 'solid 1px #b26a00',
    borderRadius: 5
  },
  item: {
    border: '1px solid ' + theme.palette.default,
  },
  greyColor: {
    backgroundColor: theme.palette.default,
    fontSize: 14
  },
  greyColor13: {
    backgroundColor: theme.palette.default,
    fontSize: 13
  },
  red13: {
    color: red[500],
    fontSize: 13

  },
  red: {
    color: red[500],
    fontSize: 14

  },
  green: {
    color: green[500],
    fontSize: 14
  },
  green13: {
    color: green[500],
    fontSize: 13
  },
  orange: {
    color: orange[500],
    fontSize: 14
  },
  orange13: {
    color: orange[500],
    fontSize: 13
  },
  padding0:{
    padding:5
  }
});

class MenuProyectoEjecucion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openExcecutionMenu: this.props.active,
      openEstructura: false,
      estructurasAbiertas: [],
    }
  }

  handleClick(idEstructura) {
    this.expandExtructure(idEstructura, true);
  };

  async handleDragFiles(idEstructura) {
    if (this.props.dragTarget)
      this.expandExtructure(idEstructura, false, true);
  }

  expandExtructure(idEstructura, load = false, onlyOpen = false) {
    let newIdEstructura = this.state.estructurasAbiertas;
    let pos = this.state.estructurasAbiertas.indexOf(idEstructura)
    if (onlyOpen) {
      if (pos === -1) {
        newIdEstructura.push(idEstructura)
      }
    }
    else {
      if (pos === -1) {
        newIdEstructura.push(idEstructura)
      } else {
        newIdEstructura.splice(pos, 1)
      }
    }

    this.setState(state => ({ estructurasAbiertas: newIdEstructura, openEstructura: state.openEstructura === idEstructura ? -1 : idEstructura }));
    if (load) {
      let estructuraPadre = this.props.estructurasPadre ? this.props.estructurasPadre.find(e => e.Titulo === idEstructura) : "";
      this.props.changeEstructura(estructuraPadre.Id_Estructura, estructuraPadre.Titulo, estructuraPadre);
    }
  }
  async markStructure(idEstructura)
  {
      await this.setState(state => ({ openEstructura:  idEstructura  }));
  }

  render() {
    let { classes } = this.props;
    return (
      <div >
        <ListItem button className={this.props.active ? classes.openOption : ""}
          onClick={() => { this.props.changeOption(this.props.trabajo.Id_Trabajo) }}>
          <ListItemText primary={this.props.trabajo.Titulo} classes={{ primary: this.props.active ? classes.textWhite : classes.font14 }} />
          {this.props.active ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Divider />
        <Collapse in={this.props.active} timeout="auto" unmountOnExit>
          {this.props.isLoadEstructura ?
            <LinearProgress className="m-3" />
            :
            Object.keys(this.props.estructuraDocumental).map((estructura, position) => {
              let estructuraPadre = this.props.estructurasPadre ? this.props.estructurasPadre.find(e => e.Titulo === estructura) : "";
              let estructuraActual = this.props.estructuraDocumental[estructura];
              return <List key={'menu-' + position}  component="div" disablePadding>
                {this.props.estructuraDocumental[estructura].length && this.props.estructuraDocumental[estructura].length > 0 ?
                  <div onDragEnter={() => this.handleDragFiles(estructura)}
                    onDragEnd={() => {  }}>
                    <ListItem style={{backgroundColor:this.state.openEstructura==estructura?'#2196f3':"white",paddingTop: 5, paddingBottom: 5}} button onClick={() => {

                      this.handleClick(estructura) }} className={`${classes.item} pl-5`}>
                      <ListItemText
                          primary={estructura + ((estructuraPadre && estructuraPadre.Archivo_Requerido !== null && estructuraPadre.Archivo_Requerido == 1) ? ' *' : '')}
                          classes={{root:classes.padding0,primary:this.state.openEstructura==estructura?classes.textWhite:classes.font14}}
                          style={{color:this.state.openEstructura==estructura?'white':"black"}}
                      />
                      {this.state.estructurasAbiertas.indexOf(estructura) != -1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.estructurasAbiertas.indexOf(estructura) != -1} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {this.props.estructuraDocumental[estructura].map((children, pos) => {
                          return <ListItem key={'menu-item' + pos} onDrop={async () => {
                            let response = await this.props.moveItemTo(children)
                            if (response)
                              this.props.changeEstructura(children.Id_Estructura, children.Titulo, children)
                          }}
                            style={{ paddingLeft: 48, paddingTop: 5, paddingBottom: 5 }}
                            className={classNames((this.props.dragTarget ? classes.dragTarget : ''),
                              (children.Id_Estructura === this.props.idEstructuraActiva ? classes.openOption : classes.greyColor))}
                            onDragOver={() => { this.setState({ drop: pos }) }} button
                            onClick={() => {

                              this.markStructure(children.Titulo_Padre)
                              this.props.changeEstructura(children.Id_Estructura, children.Titulo, children) }}>
                            <ListItemIcon style={{ marginRight: 0, fontSize: 14, marginLeft: 24 }}
                              className={children.Estado_Visual === 0 ? classes.red : (children.Estado_Visual === 1 ? classes.green : classes.font14)}>
                              {children.Estado_Visual === 0 ? <Close style={{ fontSize: 18 }} /> : (children.Estado_Visual === 1 ? <Check style={{ fontSize: 18 }} /> : <Block style={{ fontSize: 18 }} />)}
                            </ListItemIcon>
                            <ListItemText inset primary={children.Titulo + (children.Archivo_Requerido !== null && children.Archivo_Requerido == 1 ? ' *' : '')}
                              classes={{ root:classes.padding0, primary: children.Id_Estructura === this.props.idEstructuraActiva ? classes.textWhite13 : (children.Estado_Visual === 0 ? classes.red13 : (children.Estado_Visual === 1 ? classes.green13 : classes.font13)) }}
                            />
                          </ListItem>
                        })}

                      </List>
                    </Collapse>
                  </div> :
                  <ListItem key={'menu-item' + position} onDrop={async () => {
                    let response = await this.props.moveItemTo(estructuraActual)
                    if (response) {
                      this.props.changeEstructura(estructuraActual.Id_Estructura, estructuraActual.Titulo, estructuraActual)
                      this.props.refreshTree(this.props.trabajo.Id_Trabajo);
                    }
                  }}
                    style={{ paddingLeft: 25, fontSize: 14,  paddingTop: 5, paddingBottom: 5  }}
                    className={classNames((this.props.dragTarget ? classes.dragTarget : ''),
                      (estructuraActual.Id_Estructura === this.props.idEstructuraActiva ? classes.openOption : ""), classes.item)}
                    onDragOver={() => { this.setState({ drop: position }) }} button
                    onClick={() => { this.props.changeEstructura(estructuraActual.Id_Estructura, estructuraActual.Titulo, estructuraActual) }}>
                    <ListItemIcon style={{ marginRight: 0,fontSize:18 }}
                      className={estructuraActual.Estado_Visual === 0 ? classes.red : (estructuraActual.Estado_Visual === 1 && classes.green)}>
                      {estructuraActual.Estado_Visual === 0 ? <Close style={{fontSize:18}} /> : (estructuraActual.Estado_Visual === 1 ? <Check style={{fontSize:18}} /> : <Block style={{fontSize:18}} />)}
                    </ListItemIcon>
                    <ListItemText inset primary={estructuraActual.Titulo + (estructuraActual.Archivo_Requerido !== null && estructuraActual.Archivo_Requerido == 1 ? ' *' : '')}
                      classes={{root:classes.padding0, primary: estructuraActual.Id_Estructura === this.props.idEstructuraActiva ? classes.textWhite : (estructuraActual.Estado_Visual === 0 ? classes.red : (estructuraActual.Estado_Visual === 1 ? classes.green: classes.font13)) }}/>
                  </ListItem>
                }

              </List>
            })}
        </Collapse>
        <Divider />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(MenuProyectoEjecucion)));