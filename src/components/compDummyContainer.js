import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect } from 'react-redux';
import dummyComponent from './dummyComponent';

class compDummyContainer extends Component {

    render() {

        return (
            this.props.dummy &&
                <dummyComponent dummy={this.props.dummy}/>
        );
    }
}

compDummyContainer.propTypes = {
    dummy: PropTypes.string.isRequired,
};
const mapStateToProps = ({ dummy }) =>({dummy });
export default connect(mapStateToProps,null)(compDummyContainer);
