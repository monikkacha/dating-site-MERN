// var QuickBlox = require('quickblox/quickblox.min').QuickBlox

import * as _QB from "quickblox/quickblox";
const QuickBlox = _QB.QuickBlox

var CREDENTIALS = {
    appId: process.env.REACT_APP_QUICKBLOX_APPID,
    authKey: process.env.REACT_APP_QUICKBLOX_AUTHKEY,
    authSecret: process.env.REACT_APP_QUICKBLOX_AUTHSECRET,
    accountKey: process.env.REACT_APP_QUICKBLOX_ACCOUNTKEY
};

/** Config to pass into QB.init */
const CONFIG = {
    streamManagement: {
        enable: true
    }
}

/**
 * Abstraction for chat functionality of quickblox
 */
class ChatApi {
    /**
     * Mapping from connection to QuickBlox object
     * @type Map<String, Any>
     */
    connections = null

    /**
     * Mapping django's id(login) to quickblox's id
     * @type Map<String, String>
     */
    idMapping = null

    /**
     * Reverse mapping of `idMapping`
     * @type Map<String, String>
     */
    loginMappping = null

    constructor() {
        this.connections = new Map()
        this.idMapping = new Map()
        this.loginMappping = new Map()
    }

    _chatConnect = (qb, params) => {
        qb.chat.onDisconnectedListener = () => {
            console.log("QB Disconnected", qb)
        }
        qb.chat.onReconnectListener = () => {
            console.log("QB Disconnected", qb)
        }
        console.log({ params })
        qb.chat.connect(params, function(error, contactList) {
            if (error)
                console.warn(error)
            else
                console.log({ contactList })
        });
        qb.chat.onSentMessageCallback = (messageLost, messageSent) => {
            if (messageLost)
                console.warn(messageLost)
            else
                console.log("message sent", messageSent)
        };

    }



    /**
     * Create a connection with the server using provided username and password, and store it for future use
     * @param {String} login
     * @param {String} password
     * @param {Function} callback function called after session is created
     */
    openSession = (login, password, messageRecieveHandler, callback) => {
        try {
            const QB = new QuickBlox()
            QB.init(CREDENTIALS.appId, CREDENTIALS.authKey, CREDENTIALS.authSecret, CREDENTIALS.accountKey, CONFIG)
            let params = { login, password }
            QB.createSession((error, result) => {
                if (error) {
                    console.log("error creating app session", error)
                } else {
                    QB.createSession(params, (error, result) => {
                        if (error && error.detail[0] === 'Unauthorized') {
                            // Create Fake User's QuickBlox Account
                            console.log(`Creating user, ${params.login}`)
                            params = {...params, full_name: params.login }
                            QB.users.create(params, (error, result) => {
                                if (error) {
                                    console.log('creating user failed')
                                } else {
                                    this.connections.set(login, QB)
                                    const userCreds = {
                                        password: params['login'],
                                        userId: result.user_id
                                    }
                                    this._chatConnect(QB, userCreds)
                                    QB.chat.onMessageListener = messageRecieveHandler
                                    QB.chat.onSentMessageCallback = function(messageLost, messageSent) {
                                        console.log({ messageLost, messageSent })
                                    };


                                    callback instanceof Function && callback({...result, login: params['login'] })
                                }
                            })
                        } else {
                            const userCreds = {
                                password: params['login'],
                                userId: result.user_id
                            }
                            this.connections.set(login, QB)
                            this._chatConnect(QB, userCreds)
                            QB.chat.onMessageListener = messageRecieveHandler
                            QB.chat.onSentMessageCallback = function(messageLost, messageSent) {
                                console.log({ messageLost, messageSent })
                            };
                            callback instanceof Function && callback({...result, login: params['login'] })
                        }
                    })
                }
            });
        } catch (err) {
            console.log(err)
            callback(err, null)
        }

    }

    /**
     * Open multiple session if they not already exist
     * @param {{login: String, password: String}[]} creds
     */
    openAllSessions = (creds, messageRecieveHandler, callback) => {
        let doneCount = 0
        creds.push({ login: 'c35ffe71-caee-4c2b-b197-3292d9efb8b5', password: 'c35ffe71-caee-4c2b-b197-3292d9efb8b5' })
        const loginResults = []
        const callWhenDone = (result) => {
            doneCount += 1
            if (result) loginResults.push(result)
            if (doneCount >= creds.length)
                callback(loginResults)
        }
        for (const cred of creds) {
            console.log(cred)
            this.openSession(cred.login, cred.password, messageRecieveHandler(cred.login), callWhenDone)
        }
    }

    /**
     * list chat dialogues for a user (fake user)
     */
    listChatDialogue = (id, external_id, callback) => {
        const conn = this.connections.get(id)
        if (conn) {
            conn.chat.dialog.list({}, (error, result) => {
                if (error)
                    console.log(error)
                else {
                    // resolve django ID for each dialogue's occupant
                    Promise.all(

                            result.items.map(item => this.getUserLoginById(conn, item.occupants_ids.filter(occ_id => occ_id !== external_id)[0]))
                        )
                        // .then(data => callback(null, result))
                        .then(
                            data => {
                                console.log({ data });
                                callback(
                                    null, {
                                        ...result,
                                        items: result.items.map(
                                            (item, idx) => ({...item, friendId: data[idx] })
                                        )
                                    }
                                )
                            }
                        )
                        .catch(err => console.log(err))
                }
            })
        } else {
            callback({ status: 404, message: 'user not connected' })
        }
    }

    /**
     * retrieve chat history of a user(fake user) with another user
     */
    retriveHistoryWithUser(id, other_id) {

    }

    /**
     * 
     * @param {Any} qb 
     * @param {String} params 
     * @returns {Promise<Any>}
     */
    messagesList = (qb, params) => {
        return new Promise((resolve, reject) => {
            qb.chat.message.list(params, (error, messages) => {
                if (error)
                    reject(error)
                else resolve(messages)
            })
        })
    }

    /**
     * retrieve chat history of a user from a dialogue id
     * @param {String} id id of the fakeUser
     * @param {String} dialogue_id id of the 1-1 chat dialogue 
     */
    getHistoryWithDialogue = async(id, dialogue_id) => {
        const conn = this.connections.get(id)
        console.log({ connections: this.connections })
        if (!conn)
            throw { error: "Connection not found" }
        const params = {
            chat_dialog_id: dialogue_id,
            sort_desc: 'date_sent',
            limit: 100,
            skip: 0
        };
        const messages = await this.messagesList(conn, params)
        console.log({ messages })
        return messages.items
    }

    getImageFullUrl = (userId , imageId) => {
        const conn = this.connections.get(userId);
        if (conn) {
            return conn.content.privateUrl(imageId);
        }
        return "NO_DATA";
    }
    

    _sendMessage = (id, opponent_id, message) => {
        return new Promise((resolve, reject) => {
            const conn = this.connections.get(id)
            if (!conn)
                reject({ 'error': 'Connection not found' })
            else {
                console.log({ opponent_id, message })
                message.id = conn.chat.send(opponent_id, message)
                message.recipient_id = opponent_id
                message.created_at = (new Date()).toISOString()
                resolve(message)
            }
        })
    }

    /**
     * 
     * @param {String} id currently selected user
     * @param {String} dialogue_id id of the chat dialogue
     * @param {String} opponent_id quickblox message to send
     * @param {String} text 
     */
    sendTextMessage = async(id, dialogue_id, opponent_id, text) => {
        let message = {
            type: "chat",
            body: text,
            extension: {
                save_to_history: 1,
                dialog_id: dialogue_id
            },
            markable: 1
        };

        message = await this._sendMessage(id, opponent_id, message)
        return message
    }

    /**
     * Retrieve a user by their login id
     * @param {String} login
     */
    getUserIdByLogin = async(qb, login) => {
        return new Promise((resolve, reject) => {
            if (this.idMapping.get(login))
                resolve(this.idMapping.get(login))
            else
                qb.users.get({ login }, (error, result) => {
                    if (error)
                        reject(error)
                    else {
                        resolve(result.id)
                        this.idMapping.set(result.login, result.id, )
                        this.loginMappping.set(result.id, result.login)
                    }
                })
        })
    }

    getUserLoginById = async(qb, id) => {
        return new Promise((resolve, reject) => {
            let login = this.loginMappping.get(id)
            if (login) {
                resolve(login)
            } else {
                // pick any random connection if qb is undefined
                if (!qb) {
                    const entries = Array.from(this.connections.values())
                    if (entries.length === 0) {
                        reject("No connection object found")
                    } else qb = entries[0]
                }

                qb.users.listUsers({ filter: { field: 'id', param: 'in', value: [id] } }, (error, result) => {
                    if (error)
                        reject(error)
                    else {
                        const user = result.items[0].user
                        console.log({ getUserLoginById: user })
                        resolve(user.login)
                        this.idMapping.set(user.login, id)
                        this.loginMappping.set(id, user.login)
                    }
                })
            }
        })
    }

    /**
     * Create dialogue with `other_id` user
     * @param {String} id 
     * @param {String} other_id 
     */
    createDialogue = (id, other_id, callback) => {
        console.log(this.connections)

        const QB = this.connections.get(id)
        Promise.all([
            // this.getUserIdByLogin(QB, id),
            this.getUserIdByLogin(QB, other_id),
        ]).then(users => {
            console.log({ users })
            if (QB) {
                const params = {
                    type: 3,
                    occupants_ids: [users[0]]
                };
                QB.chat.dialog.create(params, function(error, result) {
                    if (error) callback(error, null)
                    else callback(error, result)
                });
            } else {
                callback({ error: 404, message: 'Connection not found for this fake user' }, null)
            }
        }).catch(err => callback(err, null))

    }


    addMessageRecieveHandler = (id, handler) => {
        const conn = this.connections.get(id)
        if (!conn)
            throw `connection for ${id} not found`
        conn.chat.onMessageListener = handler
    }

    _createAndUpload = async(qb, params) => {
        return new Promise((resolve, reject) => {
            qb.content.createAndUpload(params, (error, result) => {
                if (error) reject(error)
                else resolve(result)
            })
        })
    }

    sendAttachmentMessage = async(fakeUserId, dialogId, opponentId, fileParams) => {
        const conn = this.connections.get(fakeUserId)
        if (conn) {
            const result = await this._createAndUpload(conn, fileParams)
            const message = {
                type: "chat",
                body: "[attachment]",
                extension: {
                    save_to_history: 1,
                    dialog_id: dialogId,
                    attachments: [{ id: result.uid, type: "image" }]
                }
            };
            return await this._sendMessage(fakeUserId, opponentId, message)
        } else {
            throw Error("Connection not found")
        }
    }


}

let instance = null

/**
 * Return a singleton instance to the ChatApi interface
 * @returns {ChatApi}
 */
const getChatApi = () => {
    if (instance)
        return instance
    instance = new ChatApi()
    return instance
}

export default getChatApi