import { sessionActionTypes } from "../../constants/actions/session";
import { Api } from "../../utils/api";
import { setToken, removeToken } from "../../utils/auth";

function loginSuccess() {
    return {
        type: sessionActionTypes.LOGIN_SUCCESS
    }
}

function loginFailure(error) {
    return {
        type: sessionActionTypes.LOGIN_FAILURE,
        data: { error: error }
    }
}

export function changePassword(password) {
    return {
        type: sessionActionTypes.CHANGE_PASSWORD,
        data: { password: password }
    }
}

export function changeEmail(email) {
    return {
        type: sessionActionTypes.CHANGE_EMAIL,
        data: { email: email }
    }
}

export function loginAction(credentials) {
    return function(dispatch) {
        dispatch({
            type: sessionActionTypes.LOGIN_REQUEST
        });
        return Api.login(credentials).then(response => {
            console.log({ response })

            if (response.status === 401) {
                errorMessage = "Wrong username or password";
                dispatch(loginFailure(errorMessage));
                return;
            }
            if (response.status !== 200) {
                var errorMessage = "Unknown error. HTTP Status code: " + response.status;
                dispatch(loginFailure(errorMessage));
                return;
            }
            response.json().then(json => {
                if (!json || !json.access_token) {
                    dispatch(loginFailure());
                    return;
                }
                setToken(json.access_token);
                dispatch(loginSuccess());

            }).catch(error => {
                return error;
            });


        }).catch(error => {
            console.log('fail', error);
            dispatch(loginFailure(error));
        });
    };
}

export function logoutAction() {
    removeToken();
    return function(dispatch) {
        dispatch({
            type: sessionActionTypes.LOGOUT_REQUEST
        });
    }
}

function signUpSuccess() {
    return {
        type: sessionActionTypes.SIGN_UP_SUCCESS
    }
}

function signUpFailure(error) {
    return {
        type: sessionActionTypes.SIGN_UP_FAILURE,
        data: { error: error }
    }
}

function setSignUpKeySuccess(params) {
    return {
        type: sessionActionTypes.SET_SIGN_UP_KEY_SUCCESS,
        data: params,
    }
}

function setSignUpKeFailure(error) {
    return {
        type: sessionActionTypes.SET_SIGN_UP_KEY_FAILURE,
        data: { error: error }
    }
}

export function changeSignUpPassword(value) {
    return {
        type: sessionActionTypes.SIGN_UP_CHANGE_PASSWORD,
        data: {
            password: value
        }
    }
}

export function changeSignUpRepeatPassword(value) {
    return {
        type: sessionActionTypes.SIGN_UP_CHANGE_REPEAT_PASSWORD,
        data: {
            repeat_password: value
        }
    }
}

export function changeSignUpLastName(value) {
    return {
        type: sessionActionTypes.SIGN_UP_CHANGE_LAST_NAME,
        data: {
            last_name: value
        }
    }
}

export function changeSignUpFirstName(value) {
    return {
        type: sessionActionTypes.SIGN_UP_CHANGE_FIRST_NAME,
        data: {
            first_name: value
        }
    }
}

export function signUpAction(params) {
    return function(dispatch) {
        dispatch({
            type: sessionActionTypes.SIGN_UP_REQUEST
        });
        return Api.signUp(params).then(response => {
            if (response.status === 400) {
                errorMessage = "Invalid params";
                dispatch(signUpFailure(errorMessage));
                return;
            }
            if (response.status !== 201) {
                var errorMessage = "Unknown error. HTTP Status code: " + response.status;
                dispatch(signUpFailure(errorMessage));
                return;
            }
            dispatch(signUpSuccess());


        }).catch(error => {
            console.log('fail', error);
            dispatch(signUpFailure(error));
        });
    };
}

export function setSignUpInvitationKey(key) {
    return function(dispatch) {
        dispatch({
            type: sessionActionTypes.SET_SIGN_UP_KEY_REQUEST
        });
        return Api.applyInvitationKey(key).then(response => {
            if (response.status === 400) {
                errorMessage = "Invalid params";
                dispatch(setSignUpKeFailure(errorMessage));
                return;
            }
            if (response.status !== 200) {
                var errorMessage = "Unknown error. HTTP Status code: " + response.status;
                dispatch(setSignUpKeFailure(errorMessage));
                return;
            }
            response.json().then(json => {
                if (!json) {
                    dispatch(setSignUpKeFailure());
                    return;
                }

                dispatch(setSignUpKeySuccess(json));

            }).catch(error => {
                return error;
            });


        }).catch(error => {
            console.log('fail', error);
            dispatch(setSignUpKeFailure(error));
        });
    };
}