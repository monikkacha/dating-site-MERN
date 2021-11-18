import { workersActionTypes } from '../constants/actions/workers';
import { fakeUsersActionTypes } from '../constants/actions/fakeUsers';

const initialState = {
    workers: [],
    workersLastContact: {},
    workersLastMessage: {},
    workersActiveChats: [],
    workersStats: [],
    labels: [],
    currentWorker: {
        id: 0
    },
    fakeUsers: [],
    invitation: {
        email: '',
        is_admin_permission: false,
        is_chat_admin_permission: false,
        generated: false,
        link_value: ''
    },
    loading: false,
    error: {
        visible: false,
        header: '',
        messages: []
    }
};

export default function workers(state = initialState, action) {
    switch (action.type) {
        case workersActionTypes.CLEAR_INVITATION:
            return {
                ...state,
                invitation: {
                    email: '',
                    is_admin_permission: false,
                    is_chat_admin_permission: false,
                    generated: false
                },
                loading: false
            };

        case workersActionTypes.GET_WORKERS_LIST_REQUEST:
            return {
                ...state,
                loading: true
            };
        case workersActionTypes.GET_WORKERS_LIST_FAILURE:
            return {
                ...state,
                error: {
                    ...state.error,
                    header: action.data.header && action.data.header !== '' ? action.data.header : '',
                    messages: action.data.errors && action.data.errors.length > 0 ? action.data.errors : [],
                    visible: true
                },
                loading: false
            };
        case workersActionTypes.GET_WORKERS_LIST_SUCCESS:
            if (!action.data instanceof Array) {
                return state;
            }

            if (action.data.length === 0) {
                return state;
            }

            return {
                ...state,
                workers: action.data.workers,
                workersLastContact: action.data.last_contact || {},
                workersLastMessage: action.data.last_message || {},
                workersStats: action.data.stats || [],
                workersActiveChats: action.data.active_chats || [],
                labels: action.data.labels || [],
                error: {
                    ...state.error,
                    visible: false
                },
                newWorker: {
                    _created: false
                },
                currentWorker: {
                    _updated: false
                },
                loading: false
            };
        case workersActionTypes.DELETE_WORKER_REQUEST:
            return {
                ...state,
                loading: true
            };
        case workersActionTypes.DELETE_WORKER_FAILURE:
            return {
                ...state,
                error: {
                    ...state.error,
                    header: action.data.header && action.data.header !== '' ? action.data.header : '',
                    messages: action.data.errors && action.data.errors.length > 0 ? action.data.errors : [],
                    visible: true
                },
                loading: false
            };
        case workersActionTypes.CHANGE_EMAIL:
            return {
                ...state,
                invitation: {
                    ...state.invitation,
                    email: action.data
                }
            };

        case workersActionTypes.CHANGE_ADMIN_PERMISSION:
            return {
                ...state,
                invitation: {
                    ...state.invitation,
                    is_admin_permission: action.data,
                    is_chat_admin_permission: action.data ? false : state.invitation.is_chat_admin_permission
                }
            };

        case workersActionTypes.CHANGE_CHAT_ADMIN_PERMISSION:
            return {
                ...state,
                invitation: {
                    ...state.invitation,
                    is_chat_admin_permission: action.data,
                    is_admin_permission: action.data ? false : state.invitation.is_admin_permission,
                }
            };

        case workersActionTypes.CREATE_INVITATION_REQUEST:
            return {
                ...state,
                loading: true
            };

        case workersActionTypes.CREATE_INVITATION_FAILURE:
            return {
                ...state,
                error: {
                    ...state.error,
                    header: action.data.header && action.data.header !== '' ? action.data.header : '',
                    messages: action.data.errors && action.data.errors.length > 0 ? action.data.errors : [],
                    visible: true
                },
                loading: false
            };

        case workersActionTypes.CREATE_INVITATION_SUCCESS:

            return {
                ...state,
                error: {
                    ...state.error,
                    visible: false
                },
                invitation: {
                    ...state.invitation,
                    link_value: action.data,
                    generated: true
                },
                loading: false
            };
        case workersActionTypes.HIDE_ERROR:
            return {
                ...state,
                error: {
                    ...state.error,
                    visible: false
                }
            };

        case workersActionTypes.SELECT_WORKER:
            return {
                ...state,
                currentWorker: {
                    ...state.currentWorker,
                    id: action.data
                }
            };

        case fakeUsersActionTypes.GET_WORKER_FAKE_USERS_REQUEST:
            return {
                ...state,
                loading: true
            };

        case fakeUsersActionTypes.GET_WORKER_FAKE_USERS_FAILURE:
            return {
                ...state,
                loading: false
            };

        case fakeUsersActionTypes.GET_WORKER_FAKE_USERS_SUCCESS:
            return {
                ...state,
                fakeUsers: action.data.fake_users,
                loading: false
            };

        default:
            return state;
    }

}