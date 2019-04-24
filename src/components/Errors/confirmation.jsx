import React, { Component } from 'react';
import { withLocalize } from "react-localize-redux";
import { withStyles } from '@material-ui/core/styles';
import { Translate } from "react-localize-redux";
import { connect } from "react-redux";
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button } from "@material-ui/core";
import ReactQuill from "react-quill";
import { CircularProgress, Typography } from '@material-ui/core';


const styles = theme => ({

});

class Confirmation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExcecution: false
        }
    }

    render() {
        return (<div>
            <Dialog open={this.props.openConfirmation}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    <Translate id="languages.messages.confirmation" />
                </DialogTitle>

                <DialogContent>
                    {this.props.confirmationMessage && <Typography className="ml-1" component="h2" variant="display1"
                        gutterBottom style={{ fontSize: "1rem" }}>
                        {this.props.confirmationMessage}
                    </Typography>}
                </DialogContent>

                <DialogActions>
                    <Button onClick={async () => {
                        this.setState({ isExcecution: true });
                        await this.props.aceptConfirmation();
                        this.setState({ isExcecution: false });
                    }} variant="contained"
                        color="primary" autoFocus style={{ height: 30, minHeight: 30 }}
                        className="p-0">
                        <Translate id="languages.generalButton.yes" />
                        {this.state.isExcecution && <CircularProgress className="mx-1"
                            style={{ height: 20, width: 20, color: "white" }} />}
                    </Button>
                    <Button onClick={() => this.props.declineConfirmation()} color="primary"
                        style={{ height: 30, minHeight: 30 }} className="p-0">
                        <Translate id="languages.generalButton.no" />
                    </Button>
                </DialogActions>
            </Dialog>
        </div>);
    }
}
const mapStateToProps = (state) => {
    return {};
}
const mapDispatchToProps = (dispatch) => {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(withStyles(styles)(Confirmation)));