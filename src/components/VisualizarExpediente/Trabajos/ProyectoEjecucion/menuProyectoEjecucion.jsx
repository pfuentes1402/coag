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
    color: "white"
  },
  dragTarget: {
    border: 'solid 1px #b26a00',
    borderRadius: 5
  },
  item: {
    border: '1px solid ' + theme.palette.default
  },
  greyColor: {
    backgroundColor: theme.palette.default
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

  render() {
    let { classes } = this.props;
    return (
      <div>
        <ListItem button className={this.props.active ? classes.openOption : ""}
          onClick={() => { this.props.changeOption(this.props.trabajo.Id_Trabajo) }}>
          <ListItemText primary={this.props.trabajo.Titulo} classes={{ primary: this.props.active ? classes.textWhite : "" }} />
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
              return <List key={'menu-' + position} component="div" disablePadding>
                {this.props.estructuraDocumental[estructura].length && this.props.estructuraDocumental[estructura].length > 0 ?
                  <div onDragEnter={() => this.handleDragFiles(estructura)}
                    onDragEnd={() => { alert() }}>
                    <ListItem button onClick={() => { this.handleClick(estructura) }} className={`${classes.item} pl-5`}>
                      <ListItemText primary={estructura + ((estructuraPadre && estructuraPadre.Archivo_Requerido !== null && estructuraPadre.Archivo_Requerido == 1) ? ' *' : '')} />
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
                            style={{ paddingLeft: 48 }}
                            className={classNames((this.props.dragTarget ? classes.dragTarget : ''),
                              (children.Id_Estructura === this.props.idEstructuraActiva ? classes.openOption : classes.greyColor))}
                            onDragOver={() => { this.setState({ drop: pos }) }} button
                            onClick={() => { this.props.changeEstructura(children.Id_Estructura, children.Titulo, children) }}>
                            <ListItemIcon style={{ marginRight: 0, marginLeft: 24 }}
                              className={children.Estado_Visual === 0 ? classes.red : (children.Estado_Visual === 1 && classes.green)}>
                              {children.Estado_Visual === 0 ? <Close /> : (children.Estado_Visual === 1 ? <Check /> : <Block />)}
                            </ListItemIcon>
                            <ListItemText inset primary={children.Titulo + (children.Archivo_Requerido !== null && children.Archivo_Requerido == 1 ? ' *' : '')}
                              classes={{ primary: children.Id_Estructura === this.props.idEstructuraActiva ? classes.textWhite : (children.Estado_Visual === 0 ? classes.red : (children.Estado_Visual === 1 && classes.green)) }}
                            />
                          </ListItem>
                        })}

                      </List>
                    </Collapse>
                  </div> :
                  <ListItem key={'menu-item' + position} onDrop={async () => {
                    let response = await this.props.moveItemTo(estructuraActual)
                    if (response)
                      this.props.changeEstructura(estructuraActual.Id_Estructura, estructuraActual.Titulo, estructuraActual)
                  }}
                    style={{ paddingLeft: 48 }}
                    className={classNames((this.props.dragTarget ? classes.dragTarget : ''),
                      (estructuraActual.Id_Estructura === this.props.idEstructuraActiva ? classes.openOption : ""), classes.item)}
                    onDragOver={() => { this.setState({ drop: position }) }} button
                    onClick={() => { this.props.changeEstructura(estructuraActual.Id_Estructura, estructuraActual.Titulo, estructuraActual) }}
                  >
                    <ListItemIcon style={{ marginRight: 0 }}
                      className={estructuraActual.Estado_Visual === 0 ? classes.red : (estructuraActual.Estado_Visual === 1 && classes.green)}>
                      {estructuraActual.Estado_Visual === 0 ? <Close /> : (estructuraActual.Estado_Visual === 1 ? <Check /> : <Block />)}
                    </ListItemIcon>
                    <ListItemText inset primary={estructuraActual.Titulo + (estructuraActual.Archivo_Requerido !== null && estructuraActual.Archivo_Requerido == 1 ? ' *' : '')}
                      classes={{ primary: estructuraActual.Id_Estructura === this.props.idEstructuraActiva ? classes.textWhite : (estructuraActual.Estado_Visual === 0 ? classes.red : (estructuraActual.Estado_Visual === 1 && classes.green)) }}
                    />
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