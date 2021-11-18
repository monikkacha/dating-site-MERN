import { fakeUsersActionTypes } from "../../constants/actions/fakeUsers";
import { commonConstants } from "../../constants/common";
import { sessionActionTypes } from "../../constants/actions/session";
import { Api } from "../../utils/api";
import { prepareFromAPI, prepareToSave } from "../../utils/helpers"
import { usersActionTypes } from "../../constants/actions/users";
import { chatActionTypes } from "../../constants/actions/chat";

var messageHeader = 'API request failed';

export function setWorkerId(id) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.FAKE_USER_SET_WORKER_ID,
            data: id
        });
    }
}

export function setFakeUserId(id) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.FAKE_USER_SET_ID,
            data: id
        });
    }
}

export function changeName(name) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_NAME,
            data: name
        });
    }
}

export function changeLastName(lastName) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_LAST_NAME,
            data: lastName
        });
    }
}

export function changeAge(age) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_AGE,
            data: age
        });
    }
}

export function changeAbout(about) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_ABOUT,
            data: about
        });
    }
}

export function changeEducation(item) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_EDUCATION,
            data: item
        });
    }
}

export function changeEthnicity(item) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_ETHNICITY,
            data: item
        });
    }
}

export function changeFamilyPlans(item) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_FAMILY_PLANS,
            data: item
        });
    }
}

export function changeHeight(item) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_HEIGHT,
            data: item
        });
    }
}

export function changeInterestedIn(items) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_INTERESTED_IN,
            data: items
        });
    }
}

export function changeWork(item) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_WORK,
            data: item
        });
    }
}

export function changeZodiacSign(item) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_ZODIAC_SIGN,
            data: item
        });
    }
}

export function changePolitics(item) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_POLITICS,
            data: item
        });
    }
}

export function changeReligious(item) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_RELIGIOUS,
            data: item
        });
    }
}

export function changeTags(items) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_TAGS,
            data: items
        });
    }
}

export function changeGender(gender) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CHANGE_FAKE_USER_GENDER,
            data: gender
        });
    }
}

export function onAddImage(item) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.ADD_FAKE_USER_PHOTO,
            data: item
        });
    }
}

export function onRemoveImage(userId, item) {
    return function(dispatch) {
        Api.removeAvatarPhoto(userId, item).then(() => {
            dispatch({
                type: fakeUsersActionTypes.REMOVE_FAKE_USER_PHOTO,
                data: item
            })
        });
    }
}

export function onChangeItem(item, type, action) {
    let actionType;
    switch (type) {
        case commonConstants.BOOK_ITEM:
            if (action === commonConstants.ACTION_ADD) {
                actionType = fakeUsersActionTypes.ADD_FAKE_USER_BOOK
            } else {
                actionType = fakeUsersActionTypes.REMOVE_FAKE_USER_BOOK
            }
            break;
        case commonConstants.MOVIE_ITEM:
            if (action === commonConstants.ACTION_ADD) {
                actionType = fakeUsersActionTypes.ADD_FAKE_USER_MOVIE
            } else {
                actionType = fakeUsersActionTypes.REMOVE_FAKE_USER_MOVIE
            }
            break;
        case commonConstants.MUSIC_ITEM:
            if (action === commonConstants.ACTION_ADD) {
                actionType = fakeUsersActionTypes.ADD_FAKE_USER_MUSIC
            } else {
                actionType = fakeUsersActionTypes.REMOVE_FAKE_USER_MUSIC
            }
            break;
        case commonConstants.TV_SHOW_ITEM:
            if (action === commonConstants.ACTION_ADD) {
                actionType = fakeUsersActionTypes.ADD_FAKE_USER_TV_SHOW
            } else {
                actionType = fakeUsersActionTypes.REMOVE_FAKE_USER_TV_SHOW
            }
            break;
        case commonConstants.SPORT_TEAM_ITEM:
            if (action === commonConstants.ACTION_ADD) {
                actionType = fakeUsersActionTypes.ADD_FAKE_USER_SPORT_TEAM
            } else {
                actionType = fakeUsersActionTypes.REMOVE_FAKE_USER_SPORT_TEAM
            }
            break;
    }
    return function(dispatch) {
        dispatch({
            type: actionType,
            data: item
        });
    }
}

export function createUser(workerId, user) {
    user = prepareToSave(user);
    const createParams = {
        owner_id: workerId,
        ...user
    };
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CREATE_FAKE_USER_REQUEST
        });
        return Api.createFakeUser(createParams).then(response => {
            var errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: fakeUsersActionTypes.CREATE_FAKE_USER_FAILURE,
                    data: { header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 201) {
                dispatch({
                    type: fakeUsersActionTypes.CREATE_FAKE_USER_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }

            dispatch({
                type: fakeUsersActionTypes.CREATE_FAKE_USER_SUCCESS
            });
        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: fakeUsersActionTypes.CREATE_FAKE_USER_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    }
}

export function updateUser(workerId, uid, user) {
    const updateParams = {
        owner_id: workerId,
        data: {...user, interested_in: (user.interestedIn || []).join() }
    };
    delete updateParams.data.interestedIn
    console.log({ updateParams })
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.SAVE_FAKE_USER_REQUEST
        });
        return Api.updateFakeUser(uid, updateParams).then(response => {
            const errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: fakeUsersActionTypes.SAVE_FAKE_USER_FAILURE,
                    data: { header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: fakeUsersActionTypes.SAVE_FAKE_USER_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }

            dispatch({
                type: fakeUsersActionTypes.SAVE_FAKE_USER_SUCCESS
            });


        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: fakeUsersActionTypes.SAVE_FAKE_USER_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    }
}

export function hideError() {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.HIDE_ERROR
        });
    }
}

export function clearUser() {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.CLEAR_USER
        });
    }
}

export function getPresets() {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.GET_FAKE_USER_PRESETS_REQUEST
        });

        return Api.getFakeUsersPresets().then(response => {
            if (response.status === 401) {
                dispatch({
                    type: fakeUsersActionTypes.GET_FAKE_USER_PRESETS_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: fakeUsersActionTypes.GET_FAKE_USER_PRESETS_FAILURE,
                    data: { errors: ['Unexpected API response'], header: messageHeader }
                });
                return;
            }

            response.json().then(json => {
                if (!json.defaultPickers) {
                    dispatch({
                        type: fakeUsersActionTypes.GET_FAKE_USER_PRESETS_FAILURE,
                        data: { errors: ['Unexpected API response'], header: messageHeader }
                    });
                    return;
                }
                dispatch({
                    type: fakeUsersActionTypes.GET_FAKE_USER_PRESETS_SUCCESS,
                    data: json.defaultPickers
                });
            }).catch(error => {
                dispatch({
                    type: fakeUsersActionTypes.GET_FAKE_USER_PRESETS_FAILURE,
                    data: { errors: [error], header: messageHeader }
                });
                return error;
            });
        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: fakeUsersActionTypes.GET_FAKE_USER_PRESETS_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    }
}

export function getFakeUserDetails(id) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.GET_FAKE_USER_REQUEST
        });
        return Api.getFakeUser(id).then(response => {
            if (response.status === 401) {
                dispatch({
                    type: fakeUsersActionTypes.GET_FAKE_USER_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status === 404) {
                dispatch({
                    type: fakeUsersActionTypes.GET_FAKE_USER_FAILURE,
                    data: { errors: ['Given user is not found'], header: messageHeader }
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: fakeUsersActionTypes.GET_FAKE_USER_FAILURE,
                    data: { errors: ['Unexpected API response'], header: messageHeader }
                });
                return;
            }

            response.json().then(json => {
                if (!json) {
                    dispatch({
                        type: fakeUsersActionTypes.GET_FAKE_USER_FAILURE,
                        data: { errors: ['Unexpected API response'], header: messageHeader }
                    });
                    return
                }

                dispatch({
                    type: fakeUsersActionTypes.GET_FAKE_USER_SUCCESS,
                    data: { user: {...json, interestedIn: json.interested_in && json.interested_in.split(',').map(x => Number(x)) } }
                });
            }).catch(error => {
                console.log('fail 2', error);
                dispatch({
                    type: fakeUsersActionTypes.GET_FAKE_USER_FAILURE,
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

export function getWorkerFakeUsers(id) {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.GET_WORKER_FAKE_USERS_REQUEST
        });

        return Api.getWorkerFakeUsers(id).then(response => {
            if (response.status === 401) {
                dispatch({
                    type: fakeUsersActionTypes.GET_WORKER_FAKE_USERS_FAILURE,
                    data: { errors: ['Authorization failed'], header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: fakeUsersActionTypes.GET_WORKER_FAKE_USERS_FAILURE,
                    data: { errors: ['Unexpected API response'], header: messageHeader }
                });
                return;
            }

            response.json().then(json => {
                if (!json) {
                    dispatch({
                        type: fakeUsersActionTypes.GET_WORKER_FAKE_USERS_FAILURE,
                        data: { errors: ['Unexpected API response'], header: messageHeader }
                    });
                    return;
                }
                dispatch({
                    type: fakeUsersActionTypes.GET_WORKER_FAKE_USERS_SUCCESS,
                    data: json
                });
            }).catch(error => {
                dispatch({
                    type: fakeUsersActionTypes.GET_WORKER_FAKE_USERS_FAILURE,
                    data: { errors: [error], header: messageHeader }
                });
                return error;
            });
        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: fakeUsersActionTypes.GET_WORKER_FAKE_USERS_FAILURE,
                data: { errors: [error], header: messageHeader }
            });
        });
    }
}


export function resetSettings() {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.FAKE_USER_RESET_SETTINGS
        });
    }
}

export function uploadAvatarPhoto(userId, params) {
    return function(dispatch) {
        Api.uploadAvatarPhoto(userId, params).then(res => {
            dispatch({
                type: fakeUsersActionTypes.ADD_FAKE_USER_PHOTO,
                data: {...res, file: res.url }
            })
        })
    }

}