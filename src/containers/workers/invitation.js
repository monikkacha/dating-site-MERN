import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import MainMenu from '../../components/mainMenu';
import Invitation from '../../components/workers/invitation';
import { setActiveMenuPosition } from '../../actions/menu';
import { logoutAction } from '../../actions/session';
import { changeInvitationEmail, changeInvitationChatAdminPermission, changeInvitationAdminPermission, hideError, createInvitation } from '../../actions/workers';

class InvitationView extends Component {


    componentDidMount() {

        this.props.newInvitation();
    }

    render() {
        if (!this.props.session.isAuthenticated) {
            return <Redirect to={{pathname: '/signIn', state: {from: this.props.location}}}/>
        }
        return (
            <div>
                <MainMenu
                    needShowPrivateItems={this.props.session.isAuthenticated}
                    menu={ this.props.menu }
                    onLogout={ this.props.onLogout }
                    setActiveMenuPosition={ this.props.setActiveMenuPosition }
                    userDetails={this.props.session.userDetails}
                />
                <Invitation
                    workers={ this.props.workers }
                    changeEmail={this.props.changeInvitationEmail}
                    changeAdminPermission={this.props.changeInvitationAdminPermission}
                    changeChatAdminPermission={this.props.changeInvitationChatAdminPermission}
                    createInvitation={this.props.createInvitation}
                    hideError={this.props.hideError}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        menu: state.menu,
        users: state.users,
        session: state.session,
        workers: state.workers,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        newInvitation: () => {
            console.log('new invitation');
        },
        hideError: () => {
            hideError()(dispatch)
        },
        changeInvitationEmail: (e, data) => {
            changeInvitationEmail(data.value)(dispatch);
        },
        changeInvitationAdminPermission: (value) => {
            console.log(value);
            changeInvitationAdminPermission(value)(dispatch);
        },
        changeInvitationChatAdminPermission: (value) => {
            console.log(value);
            changeInvitationChatAdminPermission(value)(dispatch);
        },
        createInvitation: (invitation) => {
            createInvitation(invitation)(dispatch);
        },
        setActiveMenuPosition(activeMenu) {
            setActiveMenuPosition(activeMenu)(dispatch)
        },
        onLogout() {
            logoutAction()(dispatch)
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(InvitationView);
