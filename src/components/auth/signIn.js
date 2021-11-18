import React, { Component } from 'react';
import { Grid, Message, Icon, Form, Button, Segment, Input } from 'semantic-ui-react';
import PropTypes from "prop-types";

export default class SignIn extends Component {

    state = { isDirty: false };

    submitForm = () => {
        const { onSubmit, session } = this.props;
        this.setState({ isDirty: true });
        if (!this.validate(session)) {
            return
        }
        onSubmit();
    };

    validate = (session) => {
        if (session.email.length < 5) {
            return false;
        }

        if (session.password.length < 6) {
            return false;
        }

        return true;
    };

    render() {

        return (
            <div>
                <Grid centered columns={3}>
                    <Grid.Column width={4}/>
                    <Grid.Column>
                        <Form size="large" onSubmit={ e => { e.preventDefault(); this.submitForm(); } }>
                            <Segment>
                                {this.props.session.isAuthFailed &&
                                <Message negative>
                                    <Message.Header>Auth failed</Message.Header>
                                    <p>{this.props.session.authError || 'Wrong email or password'}</p>
                                </Message>
                                }

                                <Form.Input
                                    fluid
                                    icon="user"
                                    iconPosition="left"
                                    placeholder="Email"
                                    value={this.props.session.email}
                                    onChange={this.props.changeEmail}
                                    error={this.state.isDirty && this.props.session.email.length < 5}
                                    />
                                <Form.Input
                                    fluid
                                    icon="lock"
                                    iconPosition="left"
                                    placeholder="Password"
                                    type="password"
                                    value={this.props.session.password}
                                    onChange={this.props.changePassword}
                                    error={this.state.isDirty && this.props.session.password.length < 6}
                                    />
                                <Form.Button color="teal" fluid size="large">Sign In</Form.Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={4}/>
                </Grid>
            </div>
        )
    }
}

SignIn.propTypes = {
    isAuthFailed: PropTypes.bool,
    apiError: PropTypes.string,
    session: PropTypes.shape({
        email: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired
    }),
    changePassword: PropTypes.func.isRequired,
    changeEmail: PropTypes.func.isRequired
};
