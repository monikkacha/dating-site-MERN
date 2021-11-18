import _ from 'lodash';
import { usersActionTypes } from '../constants/actions/users';
import { sessionActionTypes } from '../constants/actions/session';
import { commonConstants } from '../constants/common';

const initialState = {
    users: [],
    search: '',
    currentPageSize: 0,
    sort_column: '',
    direction: 0,
    next: '',
    previous: '',
    currentUser: {
        main: {},
        details: {}
    },
    newUser: {},
    loading: false,
    error: {
        visible: false,
        header: '',
        messages: []
    }
};

export default function users(state = initialState, action) {
    switch (action.type) {
        case sessionActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                error: {
                    visible: false,
                    header: '',
                    messages: []
                }
            };
        case usersActionTypes.CLEAR_USER:
            return {
                ...state,
                newUser: {
                    ...state.newUser,
                    _created: false
                },
                currentUser: {
                    ...state.currentUser,
                    _updated: false
                },
                loading: false
            };
        case usersActionTypes.SORT_USERS_LIST:
            return {
                ...state,
                sort_column: action.column,
                direction: action.direction,
                loading: true
            };
        case usersActionTypes.GET_USERS_LIST_REQUEST:
            return {
                ...state,
                loading: true
            };
        case usersActionTypes.GET_USERS_LIST_FAILURE:
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
        case usersActionTypes.GET_USERS_LIST_SUCCESS:
            if (!action.data instanceof Array) {
                return state;
            }

            if (action.data.length === 0) {
                return state;
            }
            return {
                ...state,
                users: action.data.users,
                currentPageSize: action.data.currentPageSize,
                offset: action.data.offset,
                size: action.data.size,
                next: action.data.next,
                previous: action.data.previous,
                search: '',
                error: {
                    ...state.error,
                    visible: false
                },
                newUser: {
                    _created: false
                },
                currentUser: {
                    _updated: false
                },
                loading: false
            };
        case usersActionTypes.SEARCH_VALUE_CHANGE:
            return {
                ...state,
                search: action.data
            };

        case usersActionTypes.SEARCH_USERS_LIST_REQUEST:
            return {
                ...state,
                loading: true
            };
        case usersActionTypes.SEARCH_USERS_LIST_FAILURE:
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
        case usersActionTypes.SEARCH_USERS_LIST_SUCCESS:
            if (!action.data.results instanceof Array) {
                return {...state, loading: false };
            }
            console.log({ insideReducer: action.data })
            if (action.data.results.length === 0) {
                return {...state, loading: false };
            }


            var users = action.data.results;
            if (state.direction && state.direction === 'ascending') {
                users = _.sortBy(users, 'disabled');

            } else if (state.direction && state.direction === 'descending') {
                users = _.sortBy(users, 'disabled');
                users = users.reverse();
            }
            return {
                ...state,
                users: users,
                currentPage: '',
                nextPage: '',
                error: {
                    ...state.error,
                    visible: false
                },
                newUser: {
                    _created: false
                },
                currentUser: {
                    _updated: false
                },
                loading: false
            };

        case usersActionTypes.REMOVE_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case usersActionTypes.REMOVE_USER_FAILURE:
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

        case usersActionTypes.REMOVE_USER_SUCCESS:
            return {
                ...state,
                users: state.users.filter((user, i) => {
                    return user.uid !== action.data.uid;
                }),
                error: {
                    ...state.error,
                    visible: false
                },
                loading: false
            };

        case usersActionTypes.REMOVE_USER_REPORTS_REQUEST:
            return {
                ...state,
                loading: true
            };

        case usersActionTypes.REMOVE_USER_REPORTS_FAILURE:
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

        case usersActionTypes.REMOVE_USER_REPORTS_SUCCESS:
            return {
                ...state,
                users: state.users.map((user, i) => {
                    if (user.uid === action.data.uid) {
                        return {...user, reports: 0 }
                    }
                    return user;
                }),
                error: {
                    ...state.error,
                    visible: false
                },
                currentUser: {
                    ...state.currentUser,
                    main: {
                        ...state.currentUser.main,
                        reports: 0
                    }
                },
                loading: false
            };

        case usersActionTypes.NEW_USER:
            return {
                ...state,
                newUser: {
                    email: '',
                    _isValid: false
                },
                error: {
                    ...state.error,
                    visible: false
                }
            };
        case usersActionTypes.CHANGE_NEW_USER_EMAIL:
            var emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/igm;
            var isValid = emailRe.test(action.data);
            return {
                ...state,
                newUser: {
                    ...state.newUser,
                    email: action.data,
                    _isValid: isValid
                }
            };
        case usersActionTypes.CREATE_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case usersActionTypes.CREATE_USER_SUCCESS:
            return {
                ...state,
                newUser: {
                    ...state.newUser,
                    _isValid: false,
                    _created: true
                },
                users: [...state.users, action.data.user],
                error: {
                    ...state.error,
                    visible: false
                },
                loading: false
            };
        case usersActionTypes.CREATE_USER_FAILURE:
            return {
                ...state,
                newUser: {
                    ...state.newUser,
                    _created: false
                },
                error: {
                    ...state.error,
                    header: action.data.header && action.data.header !== '' ? action.data.header : '',
                    messages: action.data.errors && action.data.errors.length > 0 ? action.data.errors : [],
                    visible: true
                },
                loading: false
            };

        case usersActionTypes.EDIT_USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            };

        case usersActionTypes.EDIT_USER_DETAILS_SUCCESS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    details: action.data.user
                },
                error: {
                    ...state.error,
                    visible: false
                },
                loading: false
            };
        case usersActionTypes.EDIT_USER_DETAILS_FAILURE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    details: {}
                },
                error: {
                    ...state.error,
                    header: action.data.header && action.data.header !== '' ? action.data.header : '',
                    messages: action.data.errors && action.data.errors.length > 0 ? action.data.errors : [],
                    visible: true
                },
                loading: false
            };

        case usersActionTypes.EDIT_USER_MAIN_REQUEST:
            return {
                ...state,
                loading: true
            };

        case usersActionTypes.EDIT_USER_MAIN_SUCCESS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    main: action.data.user
                },
                error: {
                    ...state.error,
                    visible: false
                },
                loading: false
            };

        case usersActionTypes.EDIT_USER_MAIN_FAILURE:
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

        case usersActionTypes.BLOCK_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case usersActionTypes.BLOCK_USER_FAILURE:
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

        case usersActionTypes.BLOCK_USER_SUCCESS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    main: {
                        ...state.currentUser.main,
                        is_blocked: true
                    }
                },
                users: state.users.map((user, i) => {
                    if (user.uid === state.currentUser.main.uid) {
                        return {
                            ...user,
                            is_blocked: true
                        };
                    }
                    return user;
                }),
                loading: false
            };

        case usersActionTypes.UNBLOCK_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case usersActionTypes.UNBLOCK_USER_FAILURE:
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

        case usersActionTypes.UNBLOCK_USER_SUCCESS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    main: {
                        ...state.currentUser.main,
                        is_blocked: false
                    }
                },
                users: state.users.map((user, i) => {
                    if (user.uid === state.currentUser.main.uid) {
                        return {
                            ...user,
                            is_blocked: false
                        };
                    }
                    return user;
                }),
                loading: false
            };

        case usersActionTypes.SAVE_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case usersActionTypes.SAVE_USER_FAILURE:
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

        case usersActionTypes.SAVE_USER_SUCCESS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    _updated: true
                },
                users: state.users.map((user, i) => {
                    if (user.uid === state.currentUser.main.uid) {
                        return state.currentUser.main;
                    }
                    return user;
                }),
                loading: false
            };

        case usersActionTypes.CHANGE_NAME:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    main: {
                        ...state.currentUser.main,
                        display_name: action.data
                    },
                    details: {
                        ...state.currentUser.details,
                        name: action.data
                    }
                }
            };

        case usersActionTypes.CHANGE_AGE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    main: {
                        ...state.currentUser.main,
                        age: Number(action.data)
                    }
                }
            };

        case usersActionTypes.CHANGE_EMAIL:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    main: {
                        ...state.currentUser.main,
                        email: action.data
                    }
                }
            };

        case usersActionTypes.CHANGE_PHONE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    main: {
                        ...state.currentUser.main,
                        phone: action.data
                    }
                }
            };

        case usersActionTypes.CHANGE_ABOUT:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    main: {
                        ...state.currentUser.main,
                        about: action.data
                    }
                }
            };

        case usersActionTypes.CHANGE_GENDER:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    main: {
                        ...state.currentUser.main,
                        gender: action.data
                    }
                }
            };

        case usersActionTypes.REMOVE_IMAGE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    details: {
                        ...state.currentUser.details,
                        photos: state.currentUser.details.photos.filter((photo, i) => {
                            return photo !== action.data;
                        }),
                    }
                }
            };

        case usersActionTypes.HIDE_ERROR:
            return {
                ...state,
                error: {
                    ...state.error,
                    visible: false
                }
            };

        default:
            return state;
    }

}