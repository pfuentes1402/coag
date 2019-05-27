import {
    FETCH_EXPEDIENTES_SUCCESS,
    FETCH_SHOW_UPLOAD_FILES,
    FETCH_UPLOAD_FILES,
    SHOW_UPLOAD,
    HIDE_UPLOAD,
    FETCH_FILES,
    FETCH_DONE,
    SET_FETCHING_DONE, CANCEL_UPLOAD
} from "../../actions/expedientes/types";
import {
    FETCH_SHOW_MODAL, FETCH_HIDE_MODAL, CAMBIAESTADOMODAL,
    OCULTACAMBIAESTADOMODAL, SHOWBUSCADOR, SHOWACCIONES, BUTTON_ADD
} from "../../actions/interfaz/types"
import { GOEXPEDIENTES } from "../../actions/usuarios/types"
import { PURGE } from 'redux-persist';

const initialState =
{
    showUploadFiles: false,
    loading: true,
    modalAcciones: false,
    selectedAction: 0,
    cancelUpload:false,
    modalLoading: true,
    modal: false, muestraFiltros: true,
    contenedorAdd: false,
    contenedorPromo: false,
    showUpload: true,
    files: {
        uploadInProgress: false,
        fetchingDone: false,
        pendingUploadList: [],
        uploadLength: 0,
        currentUpload: null,
        typeUpload:null,
        currentUploadItem: null
    },
};


const reducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_FETCHING_DONE:
            let newState = {...state};
            newState.files.fetchingDone = false;
            return newState;
            
        case SHOW_UPLOAD:
            return {
                ...state,
                showUpload: true
            };
        case HIDE_UPLOAD:
            return {
                ...state,
                showUpload: false
            };
        case CANCEL_UPLOAD:
            return {
                ...state,
                cancelUpload: action.payload.cancelUpload
            };
        case FETCH_FILES:
            return {
                ...state,
                files: {
                    uploadInProgress: action.payload.uploadInProgress,
                    pendingUploadList: action.payload.pendingUploadList,
                    uploadLength: action.payload.uploadLength,
                    currentUpload: action.payload.currentUpload,
                    currentUploadItem: action.payload.currentUploadItem,
                    fetchingDone: action.payload.fetchingDone,
                    typeUpload:action.payload.typeUpload
                },
            };


        // case FETCH_UPLOAD_FILES:
        //     return {
        //         ...state,
        //         uploadFiles: {
        //             uploadInProgress: action.payload.uploadInProgress,
        //             pendingUploadList: action.payload.pendingUploadList,
        //             uploadLength: action.payload.uploadLength,
        //             fetchingDone:action.payload.fetchingDone
        //         },
        //     };
        case FETCH_SHOW_UPLOAD_FILES:
            return {
                ...state,
                showUploadFiles: action.payload,
            };

        case FETCH_EXPEDIENTES_SUCCESS:
            return {
                ...state,
                loading: false,
            };

        case FETCH_SHOW_MODAL:
            return {
                ...state,
                modalAcciones: true,

            };
        case FETCH_HIDE_MODAL:

            return {
                ...state,
                modalAcciones: false,
            };
        case CAMBIAESTADOMODAL:
            return {
                ...state,
                modalLoading: false,
            };
        case OCULTACAMBIAESTADOMODAL:
            return {
                ...state,
                modalLoading: true,
                muestraFiltros: true,
            };
        case GOEXPEDIENTES:
            return {
                ...state,
                modalAcciones: false,
            }
        case SHOWBUSCADOR:
            return {
                ...state,
                modal: true,
                muestraFiltros: false,
            }
        case SHOWACCIONES:
            return {
                ...state,
                modal: false,
            }
        case BUTTON_ADD:

            let arrq = false;
            let promo = false;
            switch (action.payload) {
                case 'Arquitectos':
                    arrq = true;
                    break;
                case 'Promotores':
                    promo = true;
                    break;
                default:
            }
            return {
                ...state,
                contenedorAdd: arrq,
                contenedorPromo: promo,
            }

        case PURGE:
            return initialState;
        default:
            return state;
    }
};

export default reducer;
