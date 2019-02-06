import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableHead, TableRow, Toolbar } from '@material-ui/core';
import { Typography, Paper, Checkbox } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Translate } from "react-localize-redux";
import { lighten } from '@material-ui/core/styles/colorManipulator';

/**Table head */
class EnhancedTableHead extends React.Component {
  render() {
    const { onSelectAllClick, numSelected, rowCount } = this.props;
    return (
      <TableHead>
        <TableRow style={{ height: 48, backgroundColor: "#faf9f9" }}>
          <TableCell padding="checkbox" className="py-0">
            <Checkbox indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick} color="primary" />
          </TableCell>
          <TableCell className="text-left text-uppercase px-0 py-0" style={{ width: 150 }}>
            <Translate id="languages.crearTrabajo.tableTitle" />
          </TableCell>
          <TableCell className="text-left text-uppercase py-0 px-3">
            <Translate id="languages.crearTrabajo.tableRequired" />
          </TableCell>
          <TableCell className="text-left text-uppercase py-0 px-3">
            <Translate id="languages.crearTrabajo.tableVisado" />
          </TableCell>
          <TableCell className="text-left text-uppercase py-0 px-3">
            <Translate id="languages.crearTrabajo.tableRegistro" />
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }
}

/**Toolbar para la tabla */
/**Estilos para el toolbar */
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
  titleMainPanel: {
    borderBottom: `2px solid ${grey[100]}`
  }
});

/**Toolbar para la tabla */
/**Funcion encargada de renderear el toolbar */
let EnhancedTableToolbar = props => {
  const { numSelected, classes, title } = props;
  return (
    <Toolbar className={classNames(classes.root, { [classes.highlight]: numSelected > 0, }, classes.titleMainPanel)}>
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
          {title} {numSelected > 0 && <Typography color="inherit" variant="subtitle1">{numSelected}
            {numSelected === 1 ? <Translate id="languages.crearTrabajo.tableSelection" />
              : <Translate id="languages.crearTrabajo.tableSelections" />}
          </Typography>}
        </Typography>
      </div>
    </Toolbar>
  );
};
EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

/**Tabla */
/**Estilos para la tabla */
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  withoutRadius: {
    borderRadius: "0 !important"
  },
});

/**Tabla */
class EnhancedTable extends React.Component {
  state = {
    selected: this.props.previusSelection ? this.props.previusSelection : [],
    dataTable: this.props.data
  };

  /*async componentDidMount() {
    this.updateSelectWorks(this.state.selected);
  }

  async loadPreviusSelection() {
    let worksSelecteds = this.state.dataTable.trabajos.filter(f =>
      this.props.previusSelection.some(x => x.Id_Tipo_Trabajo === f.Id_Tipo_Trabajo))
      .map(x => { return x.Id_Tipo_Trabajo; });
    
    await this.setState({ selected: worksSelecteds });
  }*/

  handleSelectAllClick = event => {
    if (event.target.checked) {
      let selections = this.state.dataTable.trabajos.map(n => n.Id_Tipo_Trabajo);
      this.setState(state => ({ ...state, selected: selections }));
      this.updateSelectWorks(selections);
      return;
    }
    this.setState(state => ({ ...state, selected: [] }));
    this.updateSelectWorks([]);
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    }
    else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    }
    else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    }
    else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.setState(state => ({ ...state, selected: newSelected }));
    this.updateSelectWorks(newSelected);
  };

  isSelected(id) {
    return this.state.selected.indexOf(id) !== -1;
  };

  updateSelectWorks(selection) {
    let worksSelected = this.state.dataTable.trabajos.filter(f =>
      selection.some(x => x === f.Id_Tipo_Trabajo));
    this.props.updateSelectTrabajos({
      fase: this.props.data.Id_Tipo_Fase,
      trabajos: worksSelected
    });
  }

  render() {
    const { classes } = this.props;
    const { dataTable, selected } = this.state;

    return (
      <Paper className={`${classes.root} ${classes.withoutRadius}`}>
        <EnhancedTableToolbar numSelected={selected.length} title={this.state.dataTable.fase} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead numSelected={selected.length}
              onSelectAllClick={this.handleSelectAllClick}
              rowCount={dataTable.trabajos.length} title={this.state.dataTable.fase} />
            <TableBody>
              {
                dataTable.trabajos.map((n) => {
                  const isSelected = this.isSelected(n.Id_Tipo_Trabajo);
                  return (
                    <TableRow key={n.Id_Tipo_Trabajo} hover style={{ height: 40 }}
                      onClick={event => this.handleClick(event, n.Id_Tipo_Trabajo)}
                      role="checkbox" aria-checked={isSelected}
                      tabIndex={-1} key={n.id} selected={isSelected}>
                      <TableCell padding="checkbox" className="py-0">
                        <Checkbox checked={isSelected} color="primary" padding="none" className="py-1" />
                      </TableCell>
                      <TableCell component="th" scope="row" className="p-0 text-left">
                        {n.Trabajo_Titulo}
                      </TableCell>
                      <TableCell className="text-left py-0 px-3">{n.Obligatorio ? n.Obligatorio : "--"}</TableCell>
                      <TableCell className="text-left py-0 px-3">{n.comvisado ? n.comvisado : "--"}</TableCell>
                      <TableCell className="text-left py-0 px-3">{n.comrexistro ? n.comrexistro : "--"}</TableCell>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(EnhancedTable);
