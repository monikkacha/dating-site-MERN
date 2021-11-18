import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import MainMenu from '../../components/mainMenu';
import User from '../../components/users/new';
import { newUser, changeEmail, createUser, hideError } from '../../actions/users';
import { setActiveMenuPosition } from '../../actions/menu';
import { logoutAction } from '../../actions/session';

class UserView extends Component {


    componentDidMount() {

        if (this.props.menu.activeMenu !== 'users') {
            this.props.setActiveMenuPosition('users');
        }

        this.props.newUser();
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
                    changeEmail={this.props.changeEmail}
                    createUser={this.props.createUser}
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
        newUser: () => {
            newUser()(dispatch);
        },
        hideError: () => {
            hideError()(dispatch)
        },
        changeEmail: (e, data) => {
            changeEmail(data.value)(dispatch);
        },
        createUser: (user) => {
            var newUser = {email: user.email};
            createUser(newUser)(dispatch);
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
