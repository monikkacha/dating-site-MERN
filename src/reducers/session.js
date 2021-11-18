import { sessionActionTypes } from '../constants/actions/session';
import { isAuthenticated, getUserDetails } from '../utils/auth';

const initialState = {
    isAuthFailed: false,
    isAuthenticated: isAuthenticated(),
    userDetails: getUserDetails(),
    email: "",
    password: "",
    signUp: {
        email: "",
        password: "",
        repeat_password: "",
        last_name: "",
        first_name: "",
        invitation_key: "",
        finished: false,
        failed: false
    }
};

export default function session(state = initialState, action) {
    switch (action.type) {
        case sessionActionTypes.CHANGE_PASSWORD:
            return {
                ...state,
                password: action.data.password
            };
        case sessionActionTypes.CHANGE_EMAIL:
            return {
                ...state,
                email: action.data.email
            };
        case sessionActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                userDetails: getUserDetails(),
                isAuthFailed: false,
                email: "",
                password: ""
            };
        case sessionActionTypes.LOGIN_FAILURE:
            return {
                ...state,
                isAuthFailed: true,
                authError: action.data.error,
                isAuthenticated: false
            };
        case sessionActionTypes.LOGOUT_REQUEST:
            return {
                ...state,
                userDetails: null,
                email: "",
                isAuthenticated: false
            };
        case sessionActionTypes.SIGN_UP_CHANGE_PASSWORD:
            return {
                ...state,
                signUp: {
                    ...state.signUp,
                    password: action.data.password
                }
            };
        case sessionActionTypes.SIGN_UP_CHANGE_REPEAT_PASSWORD:
            return {
                ...state,
                signUp: {
                    ...state.signUp,
                    repeat_password: action.data.repeat_password
                }
            };
        case sessionActionTypes.SIGN_UP_CHANGE_FIRST_NAME:
            return {
                ...state,
                signUp: {
                    ...state.signUp,
                    first_name: action.data.first_name
                }
            };
        case sessionActionTypes.SIGN_UP_CHANGE_LAST_NAME:
            return {
                ...state,
                signUp: {
                    ...state.signUp,
                    last_name: action.data.last_name
                }
            };
        case sessionActionTypes.SIGN_UP_SUCCESS:
            return {
                ...state,
                signUp: {
                    email: "",
                    password: "",
                    repeat_password: "",
                    last_name: "",
                    first_name: "",
                    invitation_key: "",
                    finished: true
                }
            };
        case sessionActionTypes.SIGN_UP_FAILURE:
            return {
                ...state,
                signUp: {
                    ...state.signUp,
                    failed: true
                },
                apiError: action.data.error
            };
        case sessionActionTypes.SET_SIGN_UP_KEY_SUCCESS:
            return {
                ...state,
                signUp: {
                    ...state.signUp,
                    email: action.data.email,
                    invitation_key: action.data.key,
                }
            };
        case sessionActionTypes.SET_SIGN_UP_KEY_FAILURE:
            return {
                ...state,
                signUp: {
                    ...state.signUp,
                    failed: true
                },
                apiError: action.data.error
            };
        default:
            return state;
    }

}
