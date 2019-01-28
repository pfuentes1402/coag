import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import {Fab} from '@material-ui/core';
import {Add} from '@material-ui/icons';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import {elimardelatabla,  saveAdressTostore} from "../../actions/expedientes";
import {connect} from "react-redux";
import {some, findIndex} from 'lodash';

const mapStateToProps = (state) => (
    {
        catastro: state.expedientes.addressreducida ? state.expedientes.addressreducida: [], /*Contiene arreglo de la tabla de ubicaciones */
        arrayReferencias: state.expedientes.arrayReferencias ? state.expedientes.arrayReferencias : [] /*Contiene arreglo con las referencial catastrales de cada direccion de la tabla ubicacion*/,
        addressData: state.expedientes.address ? state.expedientes.address : ''
    }
);

const mapDispatchToProps =
    {
        saveAdressTostore: saveAdressTostore,
        elimardelatabla: elimardelatabla,
    };


let counter = 0;
function createData(objectAddrees) {
    counter += 1;
    if (!objectAddrees.id) {
        objectAddrees["id"] = counter;
    }

    return objectAddrees;
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    { id: 'calle', numeric: false, disablePadding: true, label: 'Calle/Lugar' },
    { id: 'numero', numeric: false, disablePadding: true, label: 'No' },
    { id: 'Piso', numeric: false, disablePadding: true, label: 'Piso' },
    { id: 'cp', numeric: false, disablePadding: true, label: 'CP' },
    { id: 'municipio', numeric: false, disablePadding: true, label: 'Municipio' },
];

class EnhancedTableHead extends React.Component {
    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {rows.map(row => {
                        return (
                            <TableCell
                                key={row.id}
                                numeric={row.numeric}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

let EnhancedTableToolbar = props => {
    const { numSelected, classes, isShowAddress } = props;

    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        Ubicación *
                    </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Eliminar">
                        <IconButton aria-label="Delete" onClick={()=>{props.onDelete()}}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title={"Agregar"}>
                        <Fab size="small" color="primary" disabled={!isShowAddress}
                             onClick={()=>{props.onSave()}}>
                            <Add/>
                        </Fab>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        position: "relative",
    },
    table: {
        minWidth: '100%',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    button: {
        margin: theme.spacing.unit,
    },
    fab: {
        position: "absolute",
        right: 14,
        top: -21
    }
});

class EnhancedTable extends React.Component {
    state = {
        order: 'asc',
        orderBy: 'numero',
        selected: [],
        emplazamientos: [],
        location: {},        page: 0,
        rowsPerPage: 5,
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';
        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleSelectAllClick = data => event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: data.map((n, i) => i) }));
            return;
        }
        this.setState({ selected: [] });
    };

    handleClick = (event, id) => {
        this.onSelected(id)
    };

    onSelected(id){
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    async handleSaveAddress(){
        let {location} = this.props;
        let {emplazamientos} = this.state;
        let locations = [];
        Object.assign(locations, emplazamientos);
        let equal = this.ifEqual(emplazamientos, location);
        if (equal === -1) {
            locations.push(location);
        }
        else {
            locations[equal] = location;
        }

        await this.setState({ emplazamientos: locations });
        this.props.updateEmplazamientos(locations);
    }

    ifEqual(data, address){
        let equal = some(data,address);
        let index = -1;
        if (equal){
            index = findIndex(data,address);
        }
        return index;
    }

    async handleDeleteAddress(){
        const { selected } = this.state;
        let locations = [...this.state.emplazamientos];
        selected.map((s, i)=>{
            locations.splice(s - i, 1);
        });

        await this.setState({selected: [], emplazamientos: locations});
        this.props.updateEmplazamientos(locations);
    }

    getData(catastro){
        let aux = [];
        Object.keys(catastro).map(key=>{
            aux.push(createData(catastro[key]));
        })
        return aux;
    }


    render() {
        let { classes, catastro } = this.props;
        let { order, orderBy, selected, rowsPerPage, page, emplazamientos } = this.state;
        let emptyRows = rowsPerPage - Math.min(rowsPerPage, catastro.length - page * rowsPerPage);
        let data = emplazamientos;
        return (
            <Paper className={classes.root}>

                <EnhancedTableToolbar numSelected={selected.length} isShowAddress={this.props.isShowAddress} onSave={()=>{this.handleSaveAddress()}} onDelete={()=>{this.handleDeleteAddress()}}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick(data)}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {stableSort(data, getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((n, i) => {
                                    const isSelected = this.isSelected(i);
                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => this.handleClick(event, i)}
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={i}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected} />
                                            </TableCell>
                                            <TableCell component="th" scope="row" padding="none">
                                                {n.Calle}
                                            </TableCell>
                                            <TableCell numeric>{n.Numero}</TableCell>
                                            <TableCell numeric>{n.Piso}</TableCell>
                                            <TableCell numeric>{n.Codigo_Postal}</TableCell>
                                            <TableCell numeric>{n.Concello}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EnhancedTable));