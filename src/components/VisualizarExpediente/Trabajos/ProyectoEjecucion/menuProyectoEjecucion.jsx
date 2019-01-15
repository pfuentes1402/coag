import React, { Component } from 'react';
import { List, ListItem, ListSubheader, ListItemText } from '@material-ui/core';
import {
  Divider, Collapse, ExpansionPanel, ExpansionPanelSummary,
  ExpansionPanelDetails, Typography, withStyles
} from '@material-ui/core';
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import '../../index.css'

const styles = theme => ({
  openOption: {
    background: theme.palette.primary.main,
    color: "white"
  }
});

class MenuProyectoEjecucion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openExcecutionMenu: false,
      menuGroups: this.tranformMenuGroups()
    }
  }

  tranformMenuGroups() {
    return [{
      title: "Memoria",
      expand: true,
      items: [
        { title: "Memoria urbanística", state: 1, key: 1, required: false },
        { title: "Memoria descriptiva", state: 2, key: 2, required: false },
        { title: "Memoria constructiva", state: 3, key: 3, required: true },
        { title: "Cumplimiento del CTE", state: 2, key: 4, required: true },
        { title: "Cumplimiento de otra normativa", state: 1, key: 5, required: false }
      ]
    },
    {
      title: "Anejos a la memoria",
      expand: true,
      items: [
        { title: "Estudio geotécnico", state: 2, key: 1, required: false },
        { title: "Calculo de estructura", state: 1, key: 2, required: false },
        { title: "Instalaciones", state: 1, key: 3, required: false },
        { title: "Eficiencia energética", state: 1, key: 4, required: false },
        { title: "Control de calidad", state: 1, key: 5, required: false },
        { title: "Uso y mantenimineto", state: 1, key: 5, required: false }
      ]
    },
    {
      title: "Planos",
      expand: true,
      items: []
    },
    {
      title: "Pliego de condiciones",
      expand: true,
      items: []
    },
    {
      title: "Mediciones y presupuestos",
      expand: true,
      items: []
    },
    {
      title: "Otros documentos tecnicos",
      expand: true,
      items: []
    },
    {
      title: "Documentos del promotor",
      expand: true,
      items: []
    }
    ];
  }

  handleExpandMenu = () => {
    this.setState(state => ({ openExcecutionMenu: !state.openExcecutionMenu }));
  };

  handleExpandSubMenus(index) {
    let oldMenuGroups = [];
    Object.assign(oldMenuGroups, this.state.menuGroups);
    if (oldMenuGroups) {
      let action = oldMenuGroups[index].expand;
      let newMenuGroups = oldMenuGroups.map((value, i) => {
        if (i === index)
          value.expand = !action;
        return value;
      });
      this.setState({ menuGroups: newMenuGroups });
    }
  }

  render() {
    let { classes } = this.props;
    return (
      <div>
        <Divider />
        <ListItem button className={`${this.state.openExcecutionMenu ? classes.openOption : ""} pl-1 pr-2`}
          onClick={() => { this.handleExpandMenu(); this.props.changeOption("TrabajoEjecucion") }}>
          <ListItemText inset primary="Proyecto en ejecución" className={`pl-2`} />
          {this.state.openExcecutionMenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Divider />
        <Collapse in={this.state.openExcecutionMenu} timeout="auto" unmountOnExit>
          {
            this.state.menuGroups.map((value, index) => {
              return (
                <div>
                  <Divider />
                  <ListItem button className="px-2 py-2" onClick={this.handleExpandMenu} key={index}
                    onClick={() => this.handleExpandSubMenus(index)}>
                    <ListItemText inset primary={value.title} className="pl-2" />
                    {value.expand ? <ExpandMore /> : <ExpandLess />}
                  </ListItem>
                  <Divider />
                  <Collapse in={value.expand} timeout="auto" unmountOnExit>
                    <div className="py-2">
                      {
                        value.items.map((v, i) => {
                          return <ListItemText key={i} inset primary={v.title} className="pl-3" />
                        })
                      }
                    </div>
                  </Collapse>
                </div>
              )
            })
          }
        </Collapse>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(MenuProyectoEjecucion)));