import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import { withLocalize } from "react-localize-redux";
import {connect} from "react-redux";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
const styles = theme => ({
    file:{
        position:'fixed',
        bottom:10,
        right:5
    }
});
const mapStateToProps = (state) =>
{
    return (
        {
            fileUpload: state.status.files,
            showUpload: state.status.showUpload
        }
    )
};
class LoadingFiles extends Component {

    render(){
        let {classes} = this.props;
        return(
            this.props.fileUpload.uploadInProgress&&this.props.showUpload?
                    <div className={classes.file}>
                        <Paper className="p-3 d-flex">
                            <Typography variant="subtitle2" gutterBottom>
                                Subiendo archivo: {this.props.fileUpload.currentUploadItem ? this.props.fileUpload.currentUploadItem.filename : null}
                            </Typography>

                            <CircularProgress
                                className={classes.progress}
                                variant="determinate"
                                style={{marginTop:5,marginLeft:15}}
                                size={18}
                                value={this.props.fileUpload.currentUpload * 100 / this.props.fileUpload.uploadLength}
                            />
                        </Paper>
                    </div>:null
        )
    }
}

export default withRouter(connect(mapStateToProps)(withLocalize(withStyles(styles)(LoadingFiles))));