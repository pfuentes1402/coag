import React, { Component } from 'react';
import { List, ListItem, CircularProgress, ListItemText,  LinearProgress} from '@material-ui/core';
import {
  Divider, Collapse,  withStyles
} from '@material-ui/core';
import { connect } from "react-redux";
import { withLocalize } from "react-localize-redux";
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import '../../index.css'

const styles = theme => ({
  openOption: {
    background: theme.palette.primary.main,
    color: "white"
  },
    dragTarget: {


            border:'solid 1px #b26a00',
            borderRadius:5

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
                    return  <List component="div" disablePadding>
                        <ListItem button onClick={()=>{this.handleClick(estructura)}} className="pl-5">
                            <ListItemText  primary={estructura}/>
                            {this.state.openEstructura === estructura ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.openEstructura === estructura} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {this.props.estructuraDocumental[estructura].map((children,pos)=>{
                                    return <ListItem onDrop={()=>this.props.moveItemTo(children)} className={this.props.dragTarget ? classes.dragTarget: ''} onDragOver={()=>{this.setState({drop:pos})}} button onClick={()=> { this.props.changeEstructura(children.Id_Estructura)}}>
                                        <ListItemText inset primary={children.Titulo} />
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