import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Button, Dimmer, Icon, Input, Loader, Segment, Table} from 'semantic-ui-react';
import ConfirmationPopup from '../confirmationPopup';
import ErrorMessage from '../errorMessage';
import {getToken, isAllowedRole} from '../../utils/auth';
import {directionToString} from '../../utils/helpers';
import {commonConstants} from "../../constants/common";

export default class Users extends Component {
    onKeyPress = (e) => {
        if (e.key !== 'Enter') {
            return;
        }

        if (!this.props.users.search || this.props.users.search.length < 3) {
            return;
        }

        this.props.searchUsersList(this.props.users.search);
    };

    render() {
        return (
            <div>
                <Dimmer.Dimmable as={Segment} dimmed={this.props.users.loading}>
                    <Dimmer active={this.props.users.loading} inverted>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    {isAllowedRole([commonConstants.SUPER_ADMIN_ROLE], this.props.userDetails) &&
                    <Segment textAlign='center' basic>
                        <Link to={"/users/new/"}>
                            <Button size='large' color='blue' content='New user'/>
                        </Link>
                        <a href={window.location.origin + "/internal/users.csv?token=" + getToken()}>
                            <Button size='large' color='orange' content='Export users'/>
                        </a>
                    </Segment>
                    }
                    {
                        this.props.users.error && this.props.users.error.visible &&
                        <ErrorMessage error={this.props.users.error} hideError={this.props.hideError}/>
                    }
                    <Segment textAlign='center'>
                        <Button.Group>
                            <Button
                                onClick={(e, data) => this.props.getUsersList(this.props.users.offset - 25, this.props.users.direction, this.props.users.sort_column)}
                                size='large'
                                color='green'
                                disabled={!this.props.users.previous}
                                content='<  Previous page'/>
                            <Button.Or text={this.props.users.offset ? (this.props.users.offset / 25) + 1 : 1}/>
                            <Button
                                onClick={(e, data) => this.props.getUsersList(this.props.users.offset + 25, this.props.users.direction, this.props.users.sort_column)}
                                size='large'
                                color='green'
                                disabled={!this.props.users.next}
                                content='Next page  >'/>
                        </Button.Group>

                    </Segment>
                    <Segment>
                        <Input
                            fluid
                            icon={<Icon name='search' inverted={this.props.users.search.length >= 3} circular
                                        link={this.props.users.search.length >= 3}
                                        onClick={(e, data) => this.props.searchUsersList(this.props.users.search)}/>}
                            value={this.props.users.search}
                            onChange={this.props.onSearchValueChange}
                            onKeyPress={this.onKeyPress}
                            placeholder='Search...'
                        />
                        <Table sortable selectable basic='very'>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell singleLine>Display Name</Table.HeaderCell>
                                    <Table.HeaderCell singleLine>Email</Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={(this.props.users.sort_column === 'disabled') ? directionToString(this.props.users.direction) : null}
                                        onClick={(e) => this.props.sortUsersList(this.props.users.offset, this.props.users.sort_column, 'disabled', this.props.users.direction)}
                                        width={2}>
                                        Disabled
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={(this.props.users.sort_column === 'reports') ? directionToString(this.props.users.direction) : null}
                                        onClick={(e) => this.props.sortUsersList(this.props.users.offset, this.props.users.sort_column, 'reports', this.props.users.direction)}
                                        width={2}>
                                        Reports
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={(this.props.users.sort_column === 'sign_up') ? directionToString(this.props.users.direction) : null}
                                        onClick={(e) => this.props.sortUsersList(this.props.users.offset, this.props.users.sort_column, 'sign_up', this.props.users.direction)}
                                        width={2}>
                                        Sign Up
                                    </Table.HeaderCell>
                                    <Table.HeaderCell width={1}>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.props.users.users && this.props.users.users.map((user, i) => {

                                    return (
                                        <Table.Row key={i} error={user.reports > 0}>
                                            <Table.Cell>{user.display_name === '' ? '-' : user.display_name}</Table.Cell>
                                            <Table.Cell>{user.email === '' ? '-' : user.email}</Table.Cell>
                                            <Table.Cell>{user.disabled ? 'true' : 'false'}</Table.Cell>
                                            <Table.Cell>{user.reports}</Table.Cell>
                                            <Table.Cell>{(new Date(user.sign_up).toLocaleString())}</Table.Cell>
                                            <Table.Cell>
                                                <Link to={"/users/edit/" + user.id}>
                                                    <Icon link name="pencil" size="large" color="blue"/>
                                                </Link>
                                                {isAllowedRole([commonConstants.SUPER_ADMIN_ROLE], this.props.userDetails) &&
                                                <ConfirmationPopup
                                                    icon={<Icon link name="trash" size="large" color="black"/>}
                                                    onSuccessConfirm={this.props.onRemove}
                                                    entityData={{userId: user.uid}}
                                                    confirmationText="Remove current user?"/>
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </Segment>
                </Dimmer.Dimmable>

            </div>
        )
    }
}
