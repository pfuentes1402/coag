import React, { Component } from 'react';
import AppFrame from '../components/AppFrame';
import {Treebeard} from 'react-treebeard';
import './MenuAppBar.css';





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
        console.log(node);
    }

    render() {
        return (
            <div className="homeContainer">
                <Treebeard
                    data={this.props.data}
                    onToggle={this.onToggle}
                />
            </div>
        );
    }
}

export default TreeDocuments;