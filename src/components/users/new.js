import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Segment, Button, Dimmer, Loader } from 'semantic-ui-react';
import ErrorMessage from '../errorMessage';

export default class User extends Component {

    render() {
        if (this.props.users.newUser._created) {
            return <Redirect to={{pathname: '/users'}}/>
        }
        return (
        <Segment.Group>

            <Dimmer.Dimmable as={Segment} dimmed={this.props.users.loading}>
                <Dimmer active={this.props.users.loading} inverted>
                    <Loader>Loading</Loader>
                </Dimmer>
                {
                    this.props.users.error && this.props.users.error.visible &&
                    <ErrorMessage error={this.props.users.error} hideError={this.props.hideError} />
                }


                <Form>
                    <Segment secondary>
                            <Form.Input
                                fluid
                                label='Email'
                                placeholder='Email'
                                value={this.props.users.newUser.email ? this.props.users.newUser.email : ''}
                                onChange={this.props.changeEmail}
                                />
                    </Segment>
                    <Segment secondary textAlign='center'>
                        <Link to={"/users/"} >
                            <Button size='large' content='Cancel'/>
                        </Link>
                        <Button
                            size='large'
                            color='blue'
                            disabled={!this.props.users.newUser._isValid}
                            content='Create'
                            onClick={(e,data) => {e.preventDefault(); this.props.createUser(this.props.users.newUser)}}
                            />
                    </Segment>
                </Form>
            </Dimmer.Dimmable>
        </Segment.Group>
        )
    }
}
