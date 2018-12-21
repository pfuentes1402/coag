import React ,{Component} from 'react';
import { withLocalize } from "react-localize-redux";
import { Translate } from "react-localize-redux";
import {Paper, Tabs, Tab} from '@material-ui/core';
import Organismo from './addOrganismo';
import Person from './addPerson';

class Promotores extends Component{
    constructor(props){
      super(props);
        this.state = {
            promotor:  {
                "id_entidad": -1,
                "Nif": "",
                "Id_Tipo_Entidad": 1,
                "Id_Tipo_Encargante": "",/*tipo de promotor*/
                "Nombre": "",
                "Apellido1": "",
                "Apellido2": "",
                "Observaciones": "",
                "Id_Tipo_Organismo": "",
                "Mail": "",
                "Telefono": "",
                "Calle": "",
                "Numero": null,
                "Piso": null,
                "Codigo_Postal": null,
                "PorcentajesEquitativos": 1,
                "Id_Concello": null,
                "Id_Provincia": null,
                "Id_Autonomia": null,
                "Id_Pais": null
            },
            value: 0

        }
    }
    componentWillMount(){
        let {promotor} = this.state;
        this.setState({value: promotor.Id_Tipo_Entidad === 1 ? 0 : 1})
    }

    handleAddPromotor(promotor){

    }

    handleChange = (event, value) => {
        let promotor = {};
        Object.assign(promotor, this.state.promotor);
        promotor["Id_Tipo_Entidad"] = value === 0 ? 1 : 2;
        this.setState({promotor: promotor, value: value})
    };

    render(){
      return(
          <div>
              <Paper>
                  <Tabs
                      value={this.state.value}
                      onChange={this.handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      scrollable
                      scrollButtons="auto"
                  >
                      <Tab label={<Translate id="languages.agentes.titlePersona"/>} />
                      <Tab label={<Translate id="languages.agentes.titleOrganismo"/>} />
                  </Tabs>
                  {this.state.value === 0 && <Person onAddPerson={(person)=>{this.handleAddPromotor(person)}}/>}
                  {this.state.value === 1 && <Organismo onAddOrganismo={(organismo)=>{this.handleAddPromotor(organismo)}}/>}
              </Paper>
          </div>
      );
    }
}

export default withLocalize(Promotores);