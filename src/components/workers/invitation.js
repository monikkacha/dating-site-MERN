import React, { Component } from 'react';
import { Form, Segment, Button, Dimmer, Loader,  Input, Grid, Message} from 'semantic-ui-react';
import ErrorMessage from '../errorMessage';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PropTypes from "prop-types";

export default class Invitation extends Component {
    constructor(props) {
        super(props);
        this.state = {copied: false};
    }

    render() {
        const invitationLink = `${window.location.origin}${this.props.workers.invitation.link_value}`
        return (
        <Segment.Group>

            <Dimmer.Dimmable dimmed={this.props.workers.loading}>
                <Dimmer active={this.props.workers.loading} inverted>
                    <Loader>Loading</Loader>
                </Dimmer>
                {
                    this.props.workers.error && this.props.workers.error.visible &&
                    <ErrorMessage error={this.props.workers.error} hideError={this.props.hideError} />
                }

                <Segment secondary textAlign='center'>
                    <Form>
                            <Form.Input
                                disabled={this.props.workers.invitation.generated}
                                fluid
                                label='Email'
                                placeholder='Email'
                                value={this.props.workers.invitation.email ? this.props.workers.invitation.email : ''}
                                onChange={this.props.changeEmail}
                            />
                            <Form.Checkbox
                                label='Grant admin permission'
                                disabled={this.props.workers.invitation.generated || this.props.workers.invitation.email.length < 8}
                                checked={this.props.workers.invitation.is_admin_permission }
                                onChange={() => this.props.changeAdminPermission(!this.props.workers.invitation.is_admin_permission)}
                            />
                            <Form.Checkbox
                                label='Grant chat functionality to admin'
                                disabled={this.props.workers.invitation.generated || this.props.workers.invitation.email.length < 8}
                                checked={this.props.workers.invitation.is_chat_admin_permission}
                                onChange={() => this.props.changeChatAdminPermission(!this.props.workers.invitation.is_chat_admin_permission)}
                            />

                        { !this.props.workers.invitation.generated && <Button
                                size='large'
                                color='green'
                                disabled={this.props.workers.invitation.email.length < 8}
                                content='Generate invitation link'
                                onClick={(e,data) => {
                                    e.preventDefault();
                                    this.props.createInvitation(this.props.workers.invitation);
                                }}
                            />}
                    </Form>

                    { this.props.workers.invitation.generated === true &&
                        <div>
                    <CopyToClipboard
                        text={invitationLink}
                        onCopy={() => this.setState({copied: true})}>
                        <Grid>
                            <Grid.Column>
                                <Input
                                    fluid
                                    readOnly
                                    value={invitationLink}
                                    action={{
                                        color: 'teal',
                                        labelPosition: 'right',
                                        icon: 'copy',
                                        content: 'Copy',
                                    }}
                                />
                                {this.state.copied ? 'Copied' : ''}
                            </Grid.Column>
                        </Grid>
                    </CopyToClipboard>
                    <Message positive>
                        <Message.Header>Invitation link was successfully generated</Message.Header>
                        <p>
                            This invitation expires in <b>24</b> hours.
                        </p>
                    </Message>
                        </div>}

                </Segment>
            </Dimmer.Dimmable>
        </Segment.Group>
        )
    }
}

Invitation.propTypes = {
    workers: PropTypes.shape({
        loading: PropTypes.bool.isRequired,
        error: PropTypes.shape({
            visible: PropTypes.bool
        }).isRequired,
        invitation: PropTypes.shape({
            generated: PropTypes.bool.isRequired,
            email: PropTypes.string.isRequired,
            is_admin_permission: PropTypes.bool.isRequired,
            is_chat_admin_permission: PropTypes.bool.isRequired
        }).isRequired
    }).isRequired,
    changeAdminPermission: PropTypes.func.isRequired,
    changeChatAdminPermission: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired,
    createInvitation: PropTypes.func.isRequired
};
