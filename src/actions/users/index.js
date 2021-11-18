import { usersActionTypes } from "../../constants/actions/users";
import { sessionActionTypes } from "../../constants/actions/session";
import { Api } from "../../utils/api";
import { computeDirection } from "../../utils/helpers";

var messageHeader = 'API request failed';

export function getUsersList(offset, ordered, orderedField) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.GET_USERS_LIST_REQUEST
        });
        var limit = 25;
        return Api.getUsers(limit, offset, ordered, orderedField).then(response => {
            var errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: usersActionTypes.GET_USERS_LIST_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }
            if (response.status !== 200) {
                dispatch({
                    type: usersActionTypes.GET_USERS_LIST_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }
            response.json().then(json => {
                if (!json.results) {
                    dispatch({
                        type: usersActionTypes.GET_USERS_LIST_FAILURE,
                        data: { errors: ['Unexpected API response'], header: messageHeader }
                    });
                    return
                }

                dispatch({
                    type: usersActionTypes.GET_USERS_LIST_SUCCESS,
                    data: {
                        users: json.results,
                        next: json.next,
                        previous: json.previous,
                        currentPageSize: '',
                        offset: '',
                        size: json.count,
                    }
                })
            }).catch(error => {
                dispatch({
                    type: usersActionTypes.GET_USERS_LIST_FAILURE,
                    data: { errors: [error], header: messageHeader }
                });
                return error;
            });


        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.GET_USERS_LIST_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    };
}

export function removeUser(uid) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.REMOVE_USER_REQUEST
        });
        return Api.removeUser(uid).then(response => {
            var errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: usersActionTypes.REMOVE_USER_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }
            if (response.status !== 204) {
                dispatch({
                    type: usersActionTypes.REMOVE_USER_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }
            dispatch({
                type: usersActionTypes.REMOVE_USER_SUCCESS,
                data: { uid: uid }
            });

        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.REMOVE_USER_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    };
}

export function removeUserReports(uid) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.REMOVE_USER_REPORTS_REQUEST
        });
        return Api.removeUserReports(uid).then(response => {
            var errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: usersActionTypes.REMOVE_USER_REPORTS_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }
            if (response.status !== 204) {
                dispatch({
                    type: usersActionTypes.REMOVE_USER_REPORTS_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }
            dispatch({
                type: usersActionTypes.REMOVE_USER_REPORTS_SUCCESS,
                data: { uid: uid }
            });

        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.REMOVE_USER_REPORTS_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    };
}

export function newUser() {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.NEW_USER
        });
    }
}

export function setUserMain(user) {

    return function(dispatch) {
        dispatch({
            type: usersActionTypes.EDIT_USER_MAIN_SUCCESS,
            data: { user: user }
        });
    }
}

export function fetchUserMain(uid) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.EDIT_USER_MAIN_REQUEST
        });
        return Api.getUser(uid).then(response => {
            var errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: usersActionTypes.EDIT_USER_MAIN_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }
            if (response.status !== 200) {
                dispatch({
                    type: usersActionTypes.EDIT_USER_MAIN_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }
            response.json().then(json => {
                if (!json) {
                    dispatch({
                        type: usersActionTypes.EDIT_USER_MAIN_FAILURE,
                        data: { errors: ['Unexpected API response'], header: messageHeader }
                    });
                    return
                }

                dispatch({
                    type: usersActionTypes.EDIT_USER_MAIN_SUCCESS,
                    data: { user: json }
                })
            }).catch(error => {
                dispatch({
                    type: usersActionTypes.EDIT_USER_MAIN_FAILURE,
                    data: { errors: [error], header: messageHeader }
                });
                return error;
            });

        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.EDIT_USER_MAIN_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    };
}

export function setUserDetails(user) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.EDIT_USER_DETAILS_SUCCESS,
            data: { user: user }
        });
    }
}

export function fetchUserDetails(id) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.EDIT_USER_MAIN_REQUEST
        });
        return Api.getUserDetails(id).then(response => {
            if (response.status === 401) {
                dispatch({
                    type: usersActionTypes.EDIT_USER_DETAILS_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: usersActionTypes.EDIT_USER_DETAILS_FAILURE,
                    data: { errors: ['Unexpected API response'], header: messageHeader }
                });
                return;
            }

            response.json().then(json => {
                if (!json.data) {
                    dispatch({
                        type: usersActionTypes.EDIT_USER_DETAILS_FAILURE,
                        data: { errors: ['Unexpected API response'], header: messageHeader }
                    });
                    return
                }

                setUserDetails(json.data)(dispatch);
            }).catch(error => {
                console.log('fail 2', error);
                dispatch({
                    type: usersActionTypes.EDIT_USER_DETAILS_FAILURE,
                    data: { errors: [error], header: messageHeader }
                });
                return error;
            });


        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.EDIT_USER_DETAILS_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    }
}

export function blockUser(id) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.BLOCK_USER_REQUEST
        });

        return Api.blockUser(id).then(response => {
            if (response.status === 401) {
                dispatch({
                    type: usersActionTypes.BLOCK_USER_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: usersActionTypes.BLOCK_USER_FAILURE,
                    data: { errors: ['Unexpected API response'], header: messageHeader }
                });
                return;
            }
            dispatch({
                type: usersActionTypes.BLOCK_USER_SUCCESS
            });
        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.BLOCK_USER_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    }
}

export function unblockUser(id) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.UNBLOCK_USER_REQUEST
        });

        return Api.unblockUser(id).then(response => {
            if (response.status === 401) {
                dispatch({
                    type: usersActionTypes.UNBLOCK_USER_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: usersActionTypes.UNBLOCK_USER_FAILURE,
                    data: { errors: ['Unexpected API response'], header: messageHeader }
                });
                return;
            }
            dispatch({
                type: usersActionTypes.UNBLOCK_USER_SUCCESS
            });
        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.UNBLOCK_USER_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    }
}

export function saveUser(user) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.SAVE_USER_REQUEST
        });

        var id = user.main.id;
        // format user in the way server is expecting
        const { display_name, gender, about } = user.main
        const { age } = user.details
        const payload = { display_name, gender, about, age }
        return Api.updateUser(id, payload).then(response => {
            if (response.status === 401) {
                dispatch({
                    type: usersActionTypes.SAVE_USER_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: usersActionTypes.SAVE_USER_FAILURE,
                    data: { errors: ['Unexpected API response'], header: messageHeader }
                });
                return;
            }
            dispatch({
                type: usersActionTypes.SAVE_USER_SUCCESS
            });
        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.SAVE_USER_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    }
}

export function changeName(name) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.CHANGE_NAME,
            data: name
        });
    }
}

export function changePhone(phone) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.CHANGE_PHONE,
            data: phone
        });
    }
}

export function changeAge(age) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.CHANGE_AGE,
            data: age
        });
    }
}

export function changeAbout(about) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.CHANGE_ABOUT,
            data: about
        });
    }
}

export function changeGender(gender) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.CHANGE_GENDER,
            data: gender
        });
    }
}

export function changeEmail(email) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.CHANGE_NEW_USER_EMAIL,
            data: email
        });
    }
}

export function removeImage(image) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.REMOVE_IMAGE,
            data: image
        });
    }
}

export function createUser(user) {

    return function(dispatch) {
        dispatch({
            type: usersActionTypes.CREATE_USER_REQUEST
        });
        return Api.createUser(user).then(response => {
            var errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: usersActionTypes.CREATE_USER_FAILURE,
                    data: { header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status === 400) {
                response.json().then(json => {
                    if (!json.errors) {
                        dispatch({
                            type: usersActionTypes.CREATE_USER_FAILURE
                        });
                        return
                    }
                    dispatch({
                        type: usersActionTypes.CREATE_USER_FAILURE,
                        data: { errors: json.errors, header: messageHeader }
                    });
                    return
                });

                dispatch({
                    type: usersActionTypes.CREATE_USER_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }
            if (response.status !== 200) {
                dispatch({
                    type: usersActionTypes.CREATE_USER_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }

            response.json().then(json => {
                if (!json.data) {
                    dispatch({
                        type: usersActionTypes.CREATE_USER_FAILURE,
                        data: { errors: ['Unexpected API response'], header: messageHeader }
                    });
                    return;
                }
                dispatch({
                    type: usersActionTypes.CREATE_USER_SUCCESS,
                    data: { user: json.data }
                });
            }).catch(error => {
                dispatch({
                    type: usersActionTypes.CREATE_USER_FAILURE
                });
                return error;
            });


        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.CREATE_USER_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    }
}

export function hideError() {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.HIDE_ERROR
        });
    }
}

export function sortUsersList(offset, prevColumn, column, prevDirection) {

    const newDirection = computeDirection(prevColumn, column, prevDirection);

    return function(dispatch) {
        dispatch({
            type: usersActionTypes.SORT_USERS_LIST,
            column: column,
            direction: newDirection
        });
        getUsersList(offset, newDirection, column)(dispatch);
    };
}

export function onSearchValueChange(value) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.SEARCH_VALUE_CHANGE,
            data: value
        });

        if (value === '') {
            getUsersList()(dispatch);
        }
    }
}

export function searchUsersList(value) {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.SEARCH_USERS_LIST_REQUEST
        });
        return Api.searchUsers(value).then(response => {
            var errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: usersActionTypes.SEARCH_USERS_LIST_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }
            if (response.status !== 200) {
                dispatch({
                    type: usersActionTypes.SEARCH_USERS_LIST_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }
            response.json().then(json => {
                if (!json) {
                    dispatch({
                        type: usersActionTypes.SEARCH_USERS_LIST_FAILURE,
                        data: { errors: ['Unexpected API response'], header: messageHeader }
                    });
                    return
                }
                dispatch({
                    type: usersActionTypes.SEARCH_USERS_LIST_SUCCESS,
                    data: json
                })
            }).catch(error => {
                dispatch({
                    type: usersActionTypes.SEARCH_USERS_LIST_FAILURE,
                    data: { errors: [error], header: messageHeader }
                });
                return error;
            });


        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.SEARCH_USERS_LIST_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    };
}

export function clearUser() {
    return function(dispatch) {
        dispatch({
            type: usersActionTypes.CLEAR_USER
        });
    }
}