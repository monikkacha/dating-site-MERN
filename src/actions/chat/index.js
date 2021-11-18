import { chatActionTypes } from "../../constants/actions/chat";
import { Api } from "../../utils/api";
import { fakeUsersActionTypes } from "../../constants/actions/fakeUsers";
import { sessionActionTypes } from "../../constants/actions/session";
import { usersActionTypes } from "../../constants/actions/users";
import getChatApi from "../../utils/chat_api";

const messageHeader = 'API request failed';

function onSSEFailure(action, dispatch) {
    return function(error) {
        dispatch({
            type: action,
            data: error
        });
    }
}

function onSSEData(action, dispatch) {
    return function(data) {
        dispatch({
            type: action,
            data: data
        });
    }
}

export function getMessages() {
    return function(dispatch) {
        dispatch({
            type: chatActionTypes.GET_CHAT_MESSAGES_LIST_REQUEST
        });
        Api.getChatMessages(onSSEData(chatActionTypes.GET_CHAT_MESSAGES_UPDATE, dispatch), onSSEData(chatActionTypes.GET_CHAT_MESSAGES_NEW, dispatch), onSSEFailure(chatActionTypes.GET_CHAT_MESSAGES_LIST_FAILURE, dispatch));
    }
}

export function getUsersUpdates() {
    return function(dispatch) {
        dispatch({
            type: chatActionTypes.GET_CHAT_USERS_LIST_REQUEST
        });
        Api.getChatUsersDetails(onSSEData(chatActionTypes.GET_CHAT_USERS_UPDATE, dispatch), onSSEFailure(chatActionTypes.GET_CHAT_USERS_LIST_FAILURE, dispatch));
    }
}

export function getFakeUsersUpdates() {
    return function(dispatch) {
        dispatch({
            type: fakeUsersActionTypes.GET_ALL_FAKE_USERS_LIST_REQUEST
        });
        return Api.getFakeUsersDetails().then(response => {
            const errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status !== 200) {
                dispatch({
                    type: chatActionTypes.GET_ALL_FAKE_USERS_LIST_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }


            response.json().then(json => {
                dispatch({
                    type: fakeUsersActionTypes.GET_ALL_FAKE_USERS_UPDATE,
                    data: json
                });
            }).catch(error => {
                console.log('fail', error);
                dispatch({
                    type: fakeUsersActionTypes.GET_ALL_FAKE_USERS_LIST_FAILURE,
                    data: { header: messageHeader, errors: [error] }
                });
            });
        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: fakeUsersActionTypes.GET_ALL_FAKE_USERS_LIST_FAILURE,
                data: { header: messageHeader, errors: [error] }
            });
        });
    };
}

export function updateChatFakeUsers() {
    return function(dispatch) {
        dispatch({
            type: chatActionTypes.CHAT_NEED_UPDATE_FAKE_USERS
        });
    }
}

export function selectChatFakeUser(id) {
    return function(dispatch) {
        dispatch({
            type: chatActionTypes.CHAT_SELECT_FAKE_USER,
            data: id
        });
    }
}

export function selectChat(chatId, opponent_id) {
    return function(dispatch) {
        dispatch({
            type: chatActionTypes.SELECT_CHAT,
            data: { chatId, opponent_id }
        });
    }
}

export function changeFakeUserOnlineStatus(uid, online) {
    return function(dispatch) {
        dispatch({
            type: chatActionTypes.CHAT_CHANGE_FAKE_USER_STATUS_REQUEST,
            data: { uid: uid, online: online }
        });
        return Api.changeFakeUserOnlineStatus(uid, online).then(response => {
            if (response.status === 401) {
                dispatch({
                    type: chatActionTypes.CHAT_CHANGE_FAKE_USER_STATUS_FAILURE,
                    data: { uid: uid, online: online }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status === 404) {
                dispatch({
                    type: chatActionTypes.CHAT_CHANGE_FAKE_USER_STATUS_FAILURE,
                    data: { uid: uid, online: online }
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: chatActionTypes.CHAT_CHANGE_FAKE_USER_STATUS_FAILURE,
                    data: { uid: uid, online: online }
                });
                return;
            }

            dispatch({
                type: chatActionTypes.CHAT_CHANGE_FAKE_USER_STATUS_SUCCESS,
                data: { uid: uid, online: online }
            });


        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: usersActionTypes.EDIT_USER_DETAILS_FAILURE,
                data: { uid: uid, online: online }
            });
        });
    }
}

export function changeChatMessage(chatMessage) {
    return function(dispatch) {
        dispatch({
            type: chatActionTypes.CHANGE_CHAT_MESSAGE,
            data: chatMessage
        });
    }
}

export function sendChatMessage(chatId, fromName, fromUserId, recipientToken, type, message) {
    return function(dispatch) {
        dispatch({
            type: chatActionTypes.SEND_CHAT_MESSAGE_REQUEST
        });
        return Api.sendChatMessage(chatId, fromName, fromUserId, recipientToken, type, message).then(response => {
            const errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: chatActionTypes.SEND_CHAT_MESSAGE_FAILURE,
                    data: { header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: chatActionTypes.SEND_CHAT_MESSAGE_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }

            dispatch({
                type: chatActionTypes.SEND_CHAT_MESSAGE_SUCCESS
            });


        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: chatActionTypes.SEND_CHAT_MESSAGE_FAILURE,
                data: { header: messageHeader }
            });
        });
    }
}


export function readChatMessages(uid, chatId, messages) {
    return function(dispatch) {
        dispatch({
            type: chatActionTypes.READ_CHAT_MESSAGES_REQUEST,
            data: { messages, chatId }
        });
        return Api.readChatMessages(uid, chatId, messages).then(response => {
            const errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: chatActionTypes.READ_CHAT_MESSAGES_FAILURE,
                    data: { header: messageHeader }
                });
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: chatActionTypes.READ_CHAT_MESSAGES_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
                return;
            }

            dispatch({
                type: chatActionTypes.READ_CHAT_MESSAGES_SUCCESS
            });


        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: chatActionTypes.READ_CHAT_MESSAGES_FAILURE,
                data: { header: messageHeader }
            });
        });
    }
}

export function saveNotes(chatId, notes) {
    return function(dispatch) {
        return Api.saveChatNotes(chatId, notes).then(response => {
            const errorMessage = "Unknown error. HTTP Status code: " + response.status;
            if (response.status === 401) {
                dispatch({
                    type: sessionActionTypes.LOGOUT_REQUEST,
                });
                return;
            }

            if (response.status !== 200) {
                dispatch({
                    type: chatActionTypes.SAVE_CHAT_NOTES_FAILURE,
                    data: { errors: [errorMessage], header: messageHeader }
                });
            }


        }).catch(error => {
            console.log('fail', error);
            dispatch({
                type: chatActionTypes.SAVE_CHAT_NOTES_FAILURE,
                data: { header: messageHeader }
            });
        });
    }
}


// export function startNewChat(fakeUserId, realUserId) {
//     return function(dispatch) {
//         return Api.startNewChat(fakeUserId, realUserId).then(response => {
//             const errorMessage = "Unknown error. HTTP Status code: " + response.status;
//             if (response.status === 401) {
//                 dispatch({
//                     type: sessionActionTypes.LOGOUT_REQUEST,
//                 });
//                 return;
//             }

//             if (response.status !== 200) {
//                 dispatch({
//                     type: chatActionTypes.START_NEW_CHAT_FAILURE,
//                     data: { errors: [errorMessage], header: messageHeader }
//                 });
//             }


//         }).catch(error => {
//             console.log('fail', error);
//             dispatch({
//                 type: chatActionTypes.START_NEW_CHAT_FAILURE,
//                 data: { header: messageHeader }
//             });
//         });
//     }
// }

export function startNewChat(fakeUserId, realUserId) {
    const chatApi = getChatApi()

    // @todo- call django api to attach likes
    return function(dispatch) {
        Api.likeUsers(fakeUserId, realUserId).then(res => {
            chatApi.createDialogue(fakeUserId, realUserId, function(error, result) {
                console.log({ error, result })
                if (error)
                    dispatch({ type: chatActionTypes.START_NEW_CHAT_FAILURE, data: error })
                else
                    dispatch({ type: chatActionTypes.START_NEW_CHAT_SUCCESS, data: { fakeUserId, dialog: result } })
            })
        }).catch(err => dispatch({ type: chatActionTypes.START_NEW_CHAT_FAILURE, message: `${err}` }))

    }
}


export function cacheUser(id) {
    console.log({ cacheUserId: id })
    return function(dispatch) {
        Api.getUser(id).then(
            res => {
                res.json().then(user => dispatch({ type: chatActionTypes.CACHE_USER_INFO, data: { id, user } }))
            }
        ).catch(console.warn)
    }
}

/**
 * Listen for incoming messages, and dispatch action on message recieve
 * @warn cleanup function is not required according to current feature specs, but should be figured out later
 */
function messageRecieveListener(dispatch) {
    return fakeUserId => {
        return (userId, message) => {
            dispatch({
                type: chatActionTypes.APPEND_RECIEVED_MESSAGE,
                data: { userId, message: {...message, created_at: (new Date()).toISOString(), recieved_message: true } }
            })
        }
    }

}

export function getAllDialogue(fakeUserIds) {
    const chatApi = getChatApi()
    const creds = fakeUserIds.map(id => ({ login: id, password: id }))
    return function(dispatch) {
        return chatApi.openAllSessions(creds, messageRecieveListener(dispatch), (loginResults) => {
            dispatch({ type: chatActionTypes.UPDATE_FAKE_USER_DATA, data: loginResults.reduce((x, user) => ({...x, [user.login]: user.user_id }), {}) })
            console.log("Got all sessions")
            for (const id of fakeUserIds) {
                const external_id = loginResults.find(x => x.login === id).user_id
                chatApi.listChatDialogue(id, external_id, (error, result) => {
                    console.log("list", { error, result })
                    if (error)
                        console.warn(error)
                    else {

                        dispatch({ type: chatActionTypes.UPDATE_CHAT_DIALOGUE_LIST, data: { fakeUserId: id, dialogues: result.items } })

                        // cache user profiles
                        console.log({ cacheRequest: result.items.map(item => item.friendId) })
                        result.items.map(item => cacheUser(item.friendId)(dispatch))
                    }
                })
            }
        })
    }
}



export function getChatHistory(fakerUserId, dialogueId) {
    const chatApi = getChatApi()
    return function(dispatch) {
        chatApi.getHistoryWithDialogue(fakerUserId, dialogueId).then(messages => {
            dispatch({
                type: chatActionTypes.UPDATE_CHAT_HISTORY,
                data: { id: dialogueId, messages }
            })
        }).catch(console.warn)

    }
}

export function sendAttachmentMessage(fakeUserId, dialogId, opponentId, fileParams) {
    const chatApi = getChatApi()
    return function(dispatch) {
        chatApi.sendAttachmentMessage(fakeUserId, dialogId, opponentId, fileParams).then(
            message => {
                dispatch({
                    type: chatActionTypes.APPEND_CHAT_HISTORY,
                    data: { dialogueId: dialogId, message }
                })
            }
        ).catch(err => dispatch({ type: chatActionTypes.SEND_CHAT_MESSAGE_FAILURE, data: err }))
    }
}

export function sendTextMessage(fakeUserId, dialogueId, opponentId, text) {
    const chatApi = getChatApi()
    return function(dispatch) {
        chatApi.sendTextMessage(fakeUserId, dialogueId, opponentId, text).then(message => {
            dispatch({
                type: chatActionTypes.APPEND_CHAT_HISTORY,
                data: { dialogueId, message }
            })
        }).catch(console.warn)
    }
}