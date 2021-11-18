import React, { Component, useEffect } from 'react';
import {
    Button,
    Checkbox,
    Dimmer,
    Divider,
    Form,
    Grid,
    Header,
    Icon,
    Label,
    List,
    Loader,
    Popup,
    Segment
} from 'semantic-ui-react';

import ErrorMessage from '../errorMessage';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import AddNewPhoto from "../imageUpload/addNewPhoto";
import Photo from "../imageUpload/photo";
import Notes from "../chat/notes";
import ChatUsers from "../chat/userList";
import getChatApi from '../../utils/chat_api';


const FakeUserListItem = ({ item, allPreparedChats, currentFakeUser, selectChatFakeUser, changeFakeUserOnlineStatus, workerId, usersList, closeUsersList, openUsersList }) => {
    console.log({ currentFakeUser })
    const isActive = currentFakeUser.id === item.id;
    return <List.Item
        active={isActive}
        onClick={(e) => selectChatFakeUser(item.id)}>
        {<List.Content floated='right'>
            <Link
                to={"/workers/" + workerId + "/fakeUsers/edit/" + item.id}>
                <Icon link name="pencil" size="large" color="blue" />
            </Link>
        </List.Content>}
        {<List.Content floated='right'>
            <Popup
                trigger={<Icon
                    link
                    name="chat"
                    size="large"
                    color={(usersList && isActive) ? 'yellow' : 'blue'}
                    onClick={(e) => {
                        (usersList && isActive) ? closeUsersList() : openUsersList()
                    }} />}
                content='Start new chat'
                position='left center'
            />

        </List.Content>}
        {/* user online status is handled with QuickBlox https://docs.quickblox.com/docs/js-chat-user-presence */}
        <List.Content floated='right'>
            <Checkbox
                slider
                checked={item.online}
                onChange={(e) => {
                    e.stopPropagation();
                    changeFakeUserOnlineStatus(item.external_id, item.online)
                }}
            />
        </List.Content>
        <List.Content floated='right'>
            <Label
                color={item.unread_messages_count > 0 ? 'yellow' : 'grey'}>{item.unread_messages_count}</Label>
        </List.Content>
        <List.Content>
            <List.Header>
                {item.name} {item.username}
            </List.Header>
        </List.Content>
    </List.Item>
}

const ChatInboxItem = ({ dialogue, allUsers, selectChat, currentChat, workerId, item }) => {
    const user = allUsers[dialogue.friendId]
    const currentUnreadMessages = dialogue.unread_messages_count
    const active = currentChat == dialogue._id
    const locationdata = user?.location?.split(",")
    if (!user)
        return <List.Item active={active}>Loading user data...</List.Item>
    const clickHandler = () => selectChat(dialogue._id, dialogue.occupants_ids)
    return <List.Item active={active} onClick={clickHandler}>
        {<List.Content floated='right'>
            <Link
                to={"/users/edit/" + item.user_id}>
                <Icon link name="pencil" size="large" color="blue" />
            </Link>
        </List.Content>}
        <List.Content>
            <List.Content floated='right'>
                <Label
                    color={currentUnreadMessages > 0 ? 'yellow' : 'grey'}>{currentUnreadMessages}</Label>
            </List.Content>

            <List.Header>
                {user && (user.display_name || user.username)}
            </List.Header>
            <List.Content floated='left' style={{ color: "rgba(0, 0, 0, .7)" }}>
                {
                    user.location ?
                        <>
                            Lat:{locationdata && locationdata[0]}<br />
                            Lon:{locationdata && locationdata[1]}
                        </> : ""
                }
            </List.Content>
        </List.Content>
    </List.Item >
}

/**
 * Display data from chat.fakeUserChatDialogues[currentlySelectedFakeUser]
 */
const ChatInboxList = ({ allUsers, selectChat, currentChat, workerId, chatDialogues = [] }) => {



    console.log({ allUsers, chatDialogues })

    return <List divided relaxed selection>
        {chatDialogues.map(
            dialogue => <ChatInboxItem workerId={workerId} item={dialogue} currentChat={currentChat} key={dialogue.id} selectChat={selectChat} dialogue={dialogue} allUsers={allUsers} />)
        }
    </List>
}


const MessageBox = ({ currentChat, opponent , fakeUserId}) => {

    const getAttachmentImage = (singleChat , userId ,msg) => {
        console.log(msg + "in getAttachmentImage");
        if (singleChat != null) {
            console.log(msg + "in first if");
            if (singleChat.attachments != null && singleChat.attachments.length > 0) {
                console.log(msg + "in second if");
                const chatApi = getChatApi();
                var id = singleChat.attachments[0].id;
                const url = chatApi.getImageFullUrl(userId , id);
                return (<Photo src={url} height={'100px'} />);
            }     
        }
    }

    console.log({ currentChat })
    const user = opponent;
    console.log({ opponent })

    return <Segment style={{ maxHeight: '400px', height: '400px', overflowX: 'scroll' }}
        color='teal'>

        <Grid columns={2}>
            {currentChat && currentChat.map(value => {
                const date = new Date(value.created_at);
                const popUp = <Popup
                    trigger={<Segment tertiary size='tiny' style={{ background: value.recipient_id !== opponent.user_id || value.recieved_message ? "#00b5ad" : "" }}>
                        {value.url &&
                            <a target='_blank' href={value.url}>
                                <Photo src={value.url} height={'100px'} />
                            </a>}
                        {getAttachmentImage(value , fakeUserId , "Current User")}
                        <p style={{ color: value.recipient_id !== opponent.user_id || value.recieved_message ? "#fff" : "" }}>{value.message || value.body}</p>
                        <Divider hidden fitted />
                        {value.ir &&
                            <Header icon={<Icon corner size='mini' name='check' />}
                                disabled sub floated='right'
                                content={date.toLocaleString()} /> ||
                            <Header disabled sub floated='right'
                                content={date.toLocaleString()} />}
                    </Segment>}
                    content={(user && user.name) ? user.name : 'Undefined'}
                    basic
                    mouseEnterDelay={1000}
                    on='hover'
                    size={'mini'}
                // position='bottom right'
                />
                if (value.recipient_id == opponent.user_id || !!value.recieved_message) {
                    // const user = this.props.chat.allUsers[currentChat.userId];
                    return <Grid.Row textAlign={value.url ? 'center' : 'left'} key={value.id}>
                        <Grid.Column >
                            {popUp}
                        </Grid.Column >
                        <Grid.Column >
                        </Grid.Column>
                    </Grid.Row>
                } else {
                    // const user = this.props.chat.allFakeUsers[value.id];
                    const user = opponent
                    return <Grid.Row textAlign={value.url ? 'center' : 'left'} key={value.id}>
                        <Grid.Column>
                        </Grid.Column>
                        <Grid.Column>
                            {popUp}
                        </Grid.Column>
                    </Grid.Row>
                }
            })}
        </Grid>
        <div style={{ float: "left", clear: "both" }}
        />
    </Segment>
}

export default class WorkerDashboard extends Component {
    messagesEnd = null;
    state = { usersList: false };
    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    };

    onStartNewChat = (fakeUserId, realUserId) => {
        this.props.startNewChat(fakeUserId, realUserId);
        this.closeUsersList();
    }

    onUpload = (fileParams) => {
        this.props.onSendAttachment(this.props.chat.currentFakeUser.id, this.props.chat.currentChat, this.props.chat.currentOpponent, fileParams)
    }

    openUsersList = () => {
        this.setState({ usersList: true });
    }

    closeUsersList = () => {
        this.setState({ usersList: false });
    }


    componentDidMount() {
        // this.props.getAllDialogue();
        // this.props.getMessages();
        // this.props.getChatUsers();
        this.props.getWorkerFakeUsers(this.props.session.userDetails.id || this.props.session.userDetails.user_id);
        // this.scrollToBottom();

    }

    componentDidUpdate(prevProps) {
        if (this.props.chat.currentFakeUsers.length > 0 && prevProps.chat.currentFakeUsers.length === 0) {
            this.props.getAllDialogue(this.props.chat.currentFakeUsers.map(user => user.id))
        }

        if (this.props.chat.allFakeUsers !== prevProps.chat.allFakeUsers) {
            this.props.updateFakeUsers();
        }
        // this.scrollToBottom();
    }
    handleMessageSend = () => {
        this.props.sendTextMessage(this.props.chat.currentFakeUser.id, this.props.chat.currentChat, this.props.chat.currentOpponent, this.props.chat.chatMessage)
    }

    componentWillReceiveProps(prevProps) {
        if (this.props.chat.allFakeUsers !== prevProps.chat.allFakeUsers) {
            this.props.updateFakeUsers();
        }
    }

    render() {
        const workerId = this.props.session.userDetails.id || this.props.session.userDetails.user_id
        const chats = Object.entries(this.props.chat.allChats)
            .filter(([key, value]) => this.props.chat.currentFakeUser.external_id && key.includes(this.props.chat.currentFakeUser.external_id) && key.split('___').length === 2)
            .map(([key, value]) => {
                const chatParts = key.split('___');
                const userId = chatParts[0] !== this.props.chat.currentFakeUser.external_id ? chatParts[0] : chatParts[1];
                return {
                    fakeUserId: this.props.chat.currentFakeUser.external_id,
                    chatId: key,
                    userId: userId,
                    history: value.history,
                    notes: value.notes
                };
            });

        const allPreparedChats = Object.entries(this.props.chat.allChats)
            .filter(([key, value]) => key.split('___').length === 2 && key.includes('x0x'))
            .map(([key, value]) => {
                const chatParts = key.split('___');
                const userId = !chatParts[0].includes('x0x') ? chatParts[0] : chatParts[1];
                const fakeUserId = chatParts[0].includes('x0x') ? chatParts[0] : chatParts[1];
                return {
                    fakeUserId: fakeUserId,
                    chatId: key,
                    userId: userId,
                    history: value.history
                };
            });
        const currentChat = chats.find((item, index) => item.chatId === this.props.chat.currentChat);
        if (currentChat) {
            let unreadMessages = currentChat.history
                ? Object.entries(currentChat.history).filter(([key, value]) => !value.ir && value.uid !== this.props.chat.currentFakeUser.external_id).map(([key, value]) => key)
                : [];

            if (unreadMessages && unreadMessages.length > 0) {
                this.props.readChatMessages(this.props.chat.currentFakeUser.external_id, currentChat.chatId, [unreadMessages[0]]);
            }
        }

        const currentFakeUser = this.props.chat.currentFakeUsers.find((item, index) => item.id === this.props.chat.currentFakeUser.id);
        const currentRealUser = currentChat && this.props.chat.allUsers[currentChat.userId];
        const currentFakeUsers = this.props.chat.currentFakeUsers
        const chatUsers = { ...this.props.users, users: this.props.users.users.filter(user => user.roles.length === 0) }
        const currentChatDialogues = this.props.chat.fakeUserChatDialogues[currentFakeUser && currentFakeUser.id]
        const currentChatId = this.props.chat.currentChat
        const opponent = (this.props.chat.fakeUserChatDialogues[currentFakeUser && currentFakeUser.id] || []).find(x => x._id === currentChatId)
        const currentChatMessages = ((this.props.chat.allChats || {})[this.props.chat.currentChat])?.sort((x, y) => x.created_at > y.created_at)
        return (
            <div>
                <Dimmer.Dimmable dimmed={this.props.chat.loading}>
                    <Dimmer active={this.props.chat.loading} inverted>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    {
                        this.props.chat.error && this.props.chat.error.visible &&
                        <ErrorMessage error={this.props.chat.error} hideError={this.props.hideError} />
                    }
                    <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column width={6} floated='right'>
                                <Segment>
                                    <Grid columns={2} style={{ height: 750 }}>
                                        <Grid.Column width={8} style={{ height: 750, overflowY: "scroll" }}>
                                            <Header content='Moderators (fake users)' />
                                            <List divided relaxed selection verticalAlign='middle'>
                                                {currentFakeUsers.map((item, index) =>
                                                    <FakeUserListItem
                                                        currentFakeUser={this.props.chat.currentFakeUser}
                                                        allPreparedChats={allPreparedChats}
                                                        workerId={workerId}
                                                        item={item}
                                                        key={index}
                                                        selectChatFakeUser={this.props.selectChatFakeUser}
                                                        usersList={this.state.usersList}
                                                        closeUsersList={this.closeUsersList}
                                                        openUsersList={this.openUsersList}
                                                        changeFakeUserOnlineStatus={this.props.changeFakeUserOnlineStatus}
                                                    />
                                                )}
                                            </List>
                                            {false && <Grid>
                                                <Grid.Column textAlign="center">
                                                    <Link
                                                        to={"/workers/" + workerId + "/fakeUsers/new"}>
                                                        <Button circular icon='add' positive />
                                                    </Link>
                                                </Grid.Column>
                                            </Grid>}
                                        </Grid.Column>
                                        <Grid.Column width={8} style={{ height: 750, overflowY: "scroll" }}>
                                            <Header content='Users' />
                                            <ChatInboxList
                                                currentChat={this.props.chat.currentChat}
                                                allUsers={this.props.chat.usersCache}
                                                chatDialogues={currentChatDialogues}
                                                selectChat={this.props.selectChat}
                                                workerId={workerId}
                                            />

                                            <List divided relaxed selection>
                                                {chats.map((item, index) => {
                                                    console.log({ item })
                                                    const user = this.props.chat.allUsers[item.userId];
                                                    const currentUnreadMessages = allPreparedChats
                                                        .filter((c, index) => c.chatId === item.chatId)
                                                        .reduce((acc, uc) => {
                                                            if (!uc.history) {
                                                                return acc;
                                                            }
                                                            return acc + Object.entries(uc.history).filter(([key, value]) => !value.ir && value.uid !== item.fakeUserId).length;
                                                        }, 0);
                                                    return <List.Item key={index} onClick={(e) => {
                                                        this.props.selectChat(item.chatId);
                                                    }}
                                                        active={this.props.chat.currentChat && this.props.chat.currentChat === item.chatId}>
                                                        {<List.Content floated='right'>
                                                            <Link target='_blank' to={"/users/edit/" + item.userId}>
                                                                <Icon link name="pencil" size="large" color="blue" />
                                                            </Link>
                                                        </List.Content>}
                                                        <List.Content floated='right'>
                                                            <Icon
                                                                name='circle'
                                                                size='tiny'
                                                                color={(user && user.online) ? 'green' : 'yellow'}
                                                                corner
                                                            />
                                                        </List.Content>
                                                        <List.Content floated='right'>
                                                            <Label
                                                                color={currentUnreadMessages > 0 ? 'yellow' : 'grey'}>{currentUnreadMessages}</Label>
                                                        </List.Content>
                                                        <List.Content>
                                                            <List.Header>{JSON.stringify(item)}{(user && user.username) ? (user.display_name || user.username) : "Undefined"}</List.Header>
                                                            {user && user.filters && user.filters.location && user.filters.location.lat && user.filters.location.lon &&
                                                                <List.Description>{"Lat: " + user.filters.location.lat}</List.Description>}
                                                            {user && user.filters && user.filters.location && user.filters.location.lat && user.filters.location.lon &&
                                                                <List.Description>{"Lon: " + user.filters.location.lon}</List.Description>}
                                                        </List.Content>

                                                    </List.Item>
                                                })}
                                            </List>
                                        </Grid.Column>
                                    </Grid>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                {this.state.usersList && currentFakeUser && (
                                    <div>
                                        <Button icon='close' onClick={e => this.closeUsersList()} />
                                        <ChatUsers
                                            fakeUserId={this.props.chat.currentFakeUser.id}
                                            startNewChat={this.onStartNewChat}
                                            chat={this.props.chat}
                                            users={chatUsers}
                                            getUsersList={this.props.getUsersList}
                                            hideError={this.props.hideError}
                                            sortUsersList={this.props.sortUsersList}
                                            onSearchValueChange={this.props.onSearchValueChange}
                                            searchUsersList={this.props.searchUsersList} />
                                    </div>)}
                                {!this.state.usersList &&
                                    <MessageBox 
                                    currentChat={currentChatMessages} 
                                    opponent={opponent} 
                                    fakeUserId={this.props.chat.currentFakeUser.id}
                                    />}
                                {!this.state.usersList && currentChat &&
                                    <Notes id={currentChat.chatId} value={currentChat.notes || ''}
                                        saveValue={this.props.saveNotes} />}
                                {/* <Divider hidden/> */}
                                {!this.state.usersList && <Grid columns={2}>
                                    <Grid.Column>
                                        <Form reply>
                                            <Form.TextArea rows={5} value={this.props.chat.chatMessage}
                                                onChange={this.props.changeChatMessage}
                                                disabled={!this.props.chat.currentChat} />
                                            <Divider hidden />
                                            <Grid textAlign='center'>
                                                <Button
                                                    content='Send'
                                                    primary
                                                    onClick={this.handleMessageSend}
                                                    //chatId, fromName, fromUserId, recipientToken, message
                                                    // onClick={(e) => {
                                                    //     e.preventDefault();
                                                    //     this.props.sendChatMessage(
                                                    //         this.props.chat.currentChat,
                                                    //         currentFakeUser.name,
                                                    //         currentFakeUser.external_id,
                                                    //         currentRealUser.fcmToken,
                                                    //         'text',
                                                    //         this.props.chat.chatMessage
                                                    //     )
                                                    // }}
                                                    disabled={!this.props.chat.currentChat || this.props.chat.chatMessage === ""} />
                                            </Grid>
                                        </Form>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <AddNewPhoto folder={currentFakeUser ? currentFakeUser.external_id : 'images'}
                                            disabled={!this.props.chat.currentChat} height={'100px'}
                                            header={'Send image'}
                                            onUpload={this.onUpload}
                                            onAdd={(url) => {
                                                this.props.sendChatMessage(
                                                    this.props.chat.currentChat,
                                                    currentFakeUser.name,
                                                    currentFakeUser.external_id,
                                                    currentRealUser.fcmToken,
                                                    'image',
                                                    url
                                                )
                                            }} />
                                    </Grid.Column>
                                </Grid>}

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                </Dimmer.Dimmable>
            </div>
        )
    }
}

WorkerDashboard.propTypes = {
    chat: PropTypes.shape({
        loading: PropTypes.bool,
        error: PropTypes.shape({
            visible: PropTypes.bool
        })
    }).isRequired,
    session: PropTypes.shape({
        userDetails: PropTypes.shape({
            id: PropTypes.number.isRequired
        }).isRequired
    }).isRequired
};
