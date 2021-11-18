import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import MainMenu from '../../components/mainMenu';
import User from '../../components/users';
import {
    newUser,
    removeUserReports,
    changeName,
    changeAge,
    changeAbout,
    changeGender,
    changeEmail,
    changePhone,
    removeImage,
    fetchUserDetails,
    fetchUserMain,
    setUserMain,
    blockUser,
    unblockUser,
    saveUser,
    hideError} from '../../actions/users';
import { setActiveMenuPosition } from '../../actions/menu';
import { logoutAction } from '../../actions/session';

class UserView extends Component {

    componentDidMount() {
        const { id } = this.props.match.params;

        if (this.props.menu.activeMenu !== 'users') {
            this.props.setActiveMenuPosition('users');
        }

        if(id) {
            var user = this.props.users.users.find((item, i) => {
                if (item.uid === id) {
                    return item;
                }
            });

            if (typeof user === 'undefined') {
                this.props.fetchUserMain(id);
            } else {
                this.props.setUserMain(user);
            }

            this.props.fetchUserDetails(id);
        }
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
                <User
                    users={ this.props.users }
                    removeUserReports={this.props.removeUserReports}
                    changeName={this.props.changeName}
                    changeAge={this.props.changeAge}
                    changeGender={this.props.changeGender}
                    changeAbout={this.props.changeAbout}
                    changeEmail={this.props.changeEmail}
                    changePhone={this.props.changePhone}
                    removeImage={this.props.removeImage}
                    blockUser={this.props.blockUser}
                    unblockUser={this.props.unblockUser}
                    saveUser={this.props.saveUser}
                    hideError={this.props.hideError}
                    session={this.props.session}
                    />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        menu: state.menu,
        users: state.users,
        session: state.session
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        removeUserReports: (id) => {
            removeUserReports(id)(dispatch);
        },
        changeName: (e, data) => {
            changeName(data.value)(dispatch);
        },
        changeAge: (e, data) => {
            changeAge(data.value)(dispatch);
        },
        changeGender: (e, data) => {
            changeGender(data.value)(dispatch);
        },
        changeAbout: (e, data) => {
            changeAbout(data.value)(dispatch);
        },
        changePhone: (e, data) => {
            changePhone(data.value)(dispatch);
        },
        changeEmail: (e, data) => {
            changeEmail(data.value)(dispatch);
        },
        removeImage: (image) => {
            removeImage(image)(dispatch);
        },
        blockUser: (id) => {
            blockUser(id)(dispatch);
        },
        unblockUser: (id) => {
            unblockUser(id)(dispatch);
        },
        saveUser: (id, user) => {
            saveUser(id, user)(dispatch);
        },
        newUser: () => {
            newUser()(dispatch);
        },
        fetchUserDetails: (id) => {
            fetchUserDetails(id)(dispatch);
        },
        setUserMain: (user) => {
            setUserMain(user)(dispatch);
        },
        fetchUserMain: (id) => {
            fetchUserMain(id)(dispatch);
        },
        hideError: () => {
            hideError()(dispatch);
        },
        setActiveMenuPosition(activeMenu) {
            setActiveMenuPosition(activeMenu)(dispatch)
        },
        onLogout() {
            logoutAction()(dispatch)
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserView);

