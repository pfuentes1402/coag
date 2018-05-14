import { } from '../../api';

import * as types from './types';

export const fetchTiposObra = (tiposObra) => ({
    type: types.FETCH_TIPOS_OBRA,
    payload: tiposObra
});

export const fetchTipoObra = () => (dispatch) => {
    getTiposObra().then((tiposObra) => {
      dispatch(fetchTiposObra(tiposObra));
    }).catch(
        () => fetchError({ error: 'Algo ha salido mal'})
    );
};