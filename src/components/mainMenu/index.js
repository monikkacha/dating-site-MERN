import React, { Component } from 'react';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {isAllowedRole} from '../../utils/auth'
import {commonConstants} from '../../constants/common'

export default class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }
    logout(e) {
        e.preventDefault();
        if (typeof this.props.onLogout === 'function') {
            this.props.onLogout();
        }
    }
    setMenu = (name) => this.props.setActiveMenuPosition(name);
    
    render() {
        return (
            <Menu tabular inverted size="tiny">
                <Menu.Item header style={{paddingBottom: '1px'}}><div className="logo"/></Menu.Item>
                {this.props.needShowPrivateItems &&
                    <Menu.Menu>
                        <Menu.Item name="dashboard" active={this.props.menu.activeMenu === 'dashboard'}>
                            <Icon name='dashboard'/>
                            <Link to="/dashboard" onClick={() => this.setMenu('dashboard')}>Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item name="users" active={this.props.menu.activeMenu === 'users'}>
                            <Icon name='users'/>
                            <Link to="/users" onClick={() => this.setMenu('users')}>Users</Link>
                        </Menu.Item>

                    </Menu.Menu>
                    }
                    <Menu.Menu position='right'>
                        {this.props.needShowPrivateItems &&
                            <Menu.Item name='signout' onClick={this.logout}>
                                <Icon inverted color='grey' name='power' />
                                Logout
                            </Menu.Item>
                        }
                    </Menu.Menu>
            </Menu>
        )
    }
}

MainMenu.propTypes = {
    userDetails: PropTypes.shape({
        privileges:  PropTypes.object.isRequired
    }),
    needShowPrivateItems: PropTypes.bool.isRequired,
    menu: PropTypes.shape({
        activeMenu: PropTypes.string.isRequired
    }),
    setActiveMenuPosition: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired
};
