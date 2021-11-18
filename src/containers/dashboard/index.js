import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import MainMenu from '../../components/mainMenu';
import { setActiveMenuPosition } from '../../actions/menu';
import { logoutAction } from '../../actions/session';
import WorkerDashboard from "../../components/dashboard/worker";
import { isAllowedRole } from "../../utils/auth";
import { commonConstants } from "../../constants/common";
import Workers from "../../components/workers/list";
import {
    getChatHistory,
    getMessages,
    getUsersUpdates,
    getFakeUsersUpdates,
    updateChatFakeUsers,
    selectChatFakeUser,
    changeFakeUserOnlineStatus,
    selectChat,
    changeChatMessage,
    sendChatMessage,
    readChatMessages,
    saveNotes,
    startNewChat,
    getAllDialogue,
    sendTextMessage,
    sendAttachmentMessage
} from "../../actions/chat";
import { getWorkerFakeUsers } from "../../actions/fakeUsers";
import { getWorkersList, selectWorker, deleteWorker } from "../../actions/workers";
import {
    getUsersList,
    hideError,
    onSearchValueChange,
    searchUsersList,
    sortUsersList
} from "../../actions/users";

class DashboardView extends Component {
    componentDidMount() {

        if (this.props.menu.activeMenu !== 'dashboard') {
            this.props.setActiveMenuPosition('dashboard');
        }
    }

    handleChatSelect = (dialogue_id, opponent_id) => {
        this.props.selectChat(dialogue_id, opponent_id)
        if (!this.props.chat.allChats[dialogue_id])
            this.props.getChatHistory(this.props.chat.currentFakeUser.id, dialogue_id)
    }

    render() {
        console.log({stateChat: this.props.chat})
        if (!this.props.session.isAuthenticated) {
            return <Redirect to={{ pathname: '/signIn', state: { from: this.props.location } }} />
        }
        return (
            <div>
                <MainMenu
                    needShowPrivateItems={this.props.session.isAuthenticated}
                    menu={this.props.menu}
                    onLogout={this.props.onLogout}
                    setActiveMenuPosition={this.props.setActiveMenuPosition}
                    userDetails={this.props.session.userDetails}
                />
                {isAllowedRole([commonConstants.ADMIN_ROLE], this.props.session.userDetails) &&
                    <Workers
                        userDetails={this.props.session.userDetails}
                        workers={this.props.workers}
                        getWorkerFakeUsers={this.props.getWorkerFakeUsers}
                        getWorkersList={this.props.getWorkersList}
                        selectWorker={this.props.selectWorker}
                        deleteWorker={this.props.deleteWorker}
                    /> || <WorkerDashboard
                        onSendAttachment={this.props.onSendAttachment}
                        session={this.props.session}
                        chat={this.props.chat}
                        users={this.props.users}
                        getMessages={this.props.getMessages}
                        getChatUsers={this.props.getChatUsers}
                        getFakeUsers={this.props.getFakeUsers}
                        getWorkerFakeUsers={this.props.getWorkerFakeUsers}
                        updateFakeUsers={this.props.updateFakeUsers}
                        selectChatFakeUser={this.props.selectChatFakeUser}
                        changeFakeUserOnlineStatus={this.props.changeFakeUserOnlineStatus}
                        selectChat={this.handleChatSelect}
                        changeChatMessage={this.props.changeChatMessage}
                        sendChatMessage={this.props.sendChatMessage}
                        sendTextMessage={this.props.sendTextMessage}
                        readChatMessages={this.props.readChatMessages}
                        saveNotes={this.props.saveNotes}
                        getUsersList={this.props.getUsersList}
                        hideError={this.props.hideError}
                        sortUsersList={this.props.sortUsersList}
                        onSearchValueChange={this.props.onSearchValueChange}
                        searchUsersList={this.props.searchUsersList}
                        startNewChat={this.props.startNewChat}
                        getAllDialogue={this.props.getAllDialogue}
                    />
                }

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    // calculate total unread message for each fake user
    const allFakeUsers = state.chat.currentFakeUsers || []
    const allDialogues = state.chat.fakeUserChatDialogues || {}
    for (const user of allFakeUsers) {
        const dialogues = allDialogues[user.id] || []
        user.unread_messages_count = dialogues.map(x => x.unread_messages_count).reduce((x, y) => x + y, 0)
    }
    return {
        menu: state.menu,
        users: state.users,
        session: state.session,
        workers: state.workers,
        chat: {...state.chat, currentFakeUsers: allFakeUsers},
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSendAttachment(fakeUserId, dialogId, opponentId, fileParams) {
            sendAttachmentMessage(fakeUserId, dialogId, opponentId, fileParams)(dispatch)
        },
        getChatHistory(fakeUserId, dialogue_id) {
            getChatHistory(fakeUserId, dialogue_id)(dispatch)
        },
        getAllDialogue(ids) {
            getAllDialogue(ids)(dispatch);
        },
        setActiveMenuPosition(activeMenu) {
            setActiveMenuPosition(activeMenu)(dispatch)
        },
        onLogout() {
            logoutAction()(dispatch)
        },
        getMessages() {
            getMessages()(dispatch);
        },
        getChatUsers() {
            getUsersUpdates()(dispatch)
        },
        getFakeUsers() {
            getFakeUsersUpdates()(dispatch)
        },
        updateFakeUsers() {
            updateChatFakeUsers()(dispatch)
        },
        getWorkerFakeUsers(id) {
            getWorkerFakeUsers(id)(dispatch);
        },
        selectChatFakeUser(id) {
            selectChatFakeUser(id)(dispatch);
        },
        changeFakeUserOnlineStatus(uid, online) {
            changeFakeUserOnlineStatus(uid, online)(dispatch);
        },
        sendTextMessage(fakeUserId, dialogueId, opponentId, text) {
            sendTextMessage(fakeUserId, dialogueId, opponentId, text)(dispatch)
        },
        selectChat(chatId, opponent_id) {
            selectChat(chatId, opponent_id)(dispatch);
        },
        changeChatMessage(e, data) {
            changeChatMessage(data.value)(dispatch);
        },
        sendChatMessage(chatId, fromName, fromUserId, recipientToken, type, message) {
            sendChatMessage(chatId, fromName, fromUserId, recipientToken, type, message)(dispatch);
        },
        readChatMessages(uid, chatId, messages) {
            readChatMessages(uid, chatId, messages)(dispatch);
        },
        getWorkersList() {
            getWorkersList()(dispatch);
        },
        selectWorker(id) {
            selectWorker(id)(dispatch);
        },
        deleteWorker(id) {
            deleteWorker(id)(dispatch);
        },
        saveNotes(chatId, value) {
            saveNotes(chatId, value)(dispatch);
        },
        getUsersList: (offset, ordered, orderedField) => {
            getUsersList(offset, ordered, orderedField)(dispatch);
        },
        onSearchValueChange: (e, data) => {
            onSearchValueChange(data.value)(dispatch);
        },
        searchUsersList: (value) => {
            searchUsersList(value)(dispatch);
        },
        sortUsersList: (offset, prevColumn, column, prevDirection) => {
            sortUsersList(offset, prevColumn, column, prevDirection)(dispatch);
        },
        startNewChat: (fakeUserId, realUserId) => {
            startNewChat(fakeUserId, realUserId)(dispatch);
        },
        hideError: () => {
            hideError()(dispatch)
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);

