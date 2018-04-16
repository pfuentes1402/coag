import React, { Component } from 'react';
import AppFrame from '../../components/AppFrame';
import {Treebeard} from 'react-treebeard';
import '../MenuAppBar/MenuAppBar.css';
import CustomStyle from './CustomStyle'



class TreeDocuments extends Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }
    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){ node.toggled = toggled; }
        this.setState({ cursor: node });
    }

    render() {
        const treeStyle = CustomStyle;
        const animation = {    toggle: ({node: {toggled}}) => ({
            animation: {rotateZ: toggled ? 90 : 0},
            duration: 200
        }),
        drawer: (/* props */) => ({
            enter: {
                animation: 'slideDown',
                duration: 300
            },
            leave: {
                animation: 'slideUp',
                duration: 300
            }
        })
    };
        return (
            <div className="homeContainer">
                <Treebeard
                    style = {treeStyle}
                    animations = {animation}
                    data={this.props.data}
                    onToggle={this.onToggle}
                />
            </div>
        );
    }
}

export default TreeDocuments;