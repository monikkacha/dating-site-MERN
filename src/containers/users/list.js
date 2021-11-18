import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import MainMenu from '../../components/mainMenu';
import Users from '../../components/users/list';
import { getUsersList, removeUser, hideError, clearUser, sortUsersList, onSearchValueChange, searchUsersList } from '../../actions/users';
import { setActiveMenuPosition } from '../../actions/menu';
import { logoutAction } from '../../actions/session';

class UsersView extends Component {


    componentDidMount() {

        this.props.clearUser();
        if (this.props.users.users && this.props.users.users.length === 0) {
            this.props.getUsersList(this.props.users.offset, this.props.users.ordered, this.props.users.orderedField, this.props.users.direction);
        }

        if (this.props.menu.activeMenu !== 'users') {
            this.props.setActiveMenuPosition('users');
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
                <Users
                    users={ this.props.users }
                    onRemove={this.props.removeUser}
                    getUsersList={this.props.getUsersList}
                    hideError={this.props.hideError}
                    sortUsersList={this.props.sortUsersList}
                    onSearchValueChange={this.props.onSearchValueChange}
                    searchUsersList={this.props.searchUsersList}
                    userDetails={this.props.session.userDetails}
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
        clearUser: () => {
            clearUser()(dispatch);
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
        removeUser: (e, data) => {
            removeUser(data.userId)(dispatch);
        },
        hideError: () => {
            hideError()(dispatch)
        },
        setActiveMenuPosition(activeMenu) {
            setActiveMenuPosition(activeMenu)(dispatch)
        },
        onLogout() {
            logoutAction()(dispatch)
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);

