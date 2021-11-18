import React, { Component } from 'react';
import {Form, Segment, Message, Grid} from 'semantic-ui-react';
import PropTypes from "prop-types";

export default class SignUp extends Component {

    state = { isDirty: false };

    submitForm = () => {
        const { onSubmit, session } = this.props;
        this.setState({ isDirty: true });
        if (!this.validate(session.signUp)) {
            return
        }
        onSubmit();
    };

    validate = (session) => {
        if (session.last_name.length < 1) {
            return false;
        }

        if (session.first_name.length < 1) {
            return false;
        }

        if (session.password.length < 6) {
            return false;
        }

        if (session.repeat_password.length < 6) {
            return false;
        }

        if (session.repeat_password !== session.password) {
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
                        <Form size="large" onSubmit={ e => { e.preventDefault(); this.submitForm(); } } autoComplete='off'>
                            <Segment>
                                {this.props.session.signUp.failed &&
                                <Message negative>
                                    <Message.Header>Sign Up failed</Message.Header>
                                    <p>{this.props.session.apiError || 'Wrong params'}</p>
                                </Message>
                                }

                                <Form.Input
                                    fluid
                                    icon="envelope"
                                    iconPosition="left"
                                    disabled
                                    readOnly={true}
                                    value={this.props.session.signUp.email}
                                />
                                <Form.Input
                                    fluid
                                    icon="user"
                                    iconPosition="left"
                                    placeholder="Last name"
                                    value={this.props.session.signUp.last_name}
                                    onChange={this.props.changeLastName}
                                    autoComplete='new-password'
                                    error={this.state.isDirty && this.props.session.signUp.last_name.length < 5}
                                />
                                <Form.Input
                                    fluid
                                    icon="user"
                                    iconPosition="left"
                                    placeholder="First name"
                                    value={this.props.session.signUp.first_name}
                                    onChange={this.props.changeFirstName}
                                    autoComplete='new-password'
                                    error={this.state.isDirty && this.props.session.signUp.first_name.length < 6}
                                />
                                <Form.Input
                                    fluid
                                    icon="lock"
                                    iconPosition="left"
                                    placeholder="Password"
                                    type="password"
                                    value={this.props.session.signUp.password}
                                    onChange={this.props.changePassword}
                                    autoComplete='new-password'
                                    error={this.state.isDirty && this.props.session.signUp.password.length < 6}
                                />
                                <Form.Input
                                    fluid
                                    icon="lock"
                                    iconPosition="left"
                                    placeholder="Repeat password"
                                    type="password"
                                    value={this.props.session.signUp.repeat_password}
                                    onChange={this.props.changeRepeatPassword}
                                    autoComplete='new-password'
                                    error={this.state.isDirty && (this.props.session.signUp.repeat_password.length < 6 || this.props.session.signUp.password !== this.props.session.signUp.repeat_password)}
                                />
                                <Form.Button color="teal" fluid size="large">Sign Up</Form.Button>
                            </Segment>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={4}/>
                </Grid>
            </div>
        )
    }
}

SignUp.propTypes = {
    isAuthFailed: PropTypes.bool,
    isSignUpFinished: PropTypes.bool,
    apiError: PropTypes.string,
    session: PropTypes.shape({
        signUp: PropTypes.shape({
            email: PropTypes.string.isRequired,
            password: PropTypes.string.isRequired,
            repeat_password: PropTypes.string.isRequired,
            last_name: PropTypes.string.isRequired,
            first_name: PropTypes.string.isRequired,
            failed: PropTypes.bool.isRequired,
            finished: PropTypes.bool.isRequired
        }),
    }),
    changePassword: PropTypes.func.isRequired,
    changeRepeatPassword: PropTypes.func.isRequired,
    changeFirstName: PropTypes.func.isRequired,
    changeLastName: PropTypes.func.isRequired,
};
