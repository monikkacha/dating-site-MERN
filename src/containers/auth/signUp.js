import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Message } from 'semantic-ui-react';

import { signUpAction, setSignUpInvitationKey, changeSignUpPassword, changeSignUpRepeatPassword, changeSignUpFirstName, changeSignUpLastName, logoutAction } from '../../actions/session';

import MainMenu from '../../components/mainMenu';
import SignUp from '../../components/auth/signUp';

class SignUpView extends Component {

    submit = () => {
        var params = {
            invitation_key: this.props.session.signUp.invitation_key,
            password: this.props.session.signUp.password,
            last_name: this.props.session.signUp.last_name,
            first_name: this.props.session.signUp.first_name,
        };
        this.props.signUp(params);
    };

    componentDidMount() {
        console.log(this.props.location.search);
        var params = this.props.location.search.split('=');
        console.log(params)
        if (params.length !== 2) {
            return
        }
        this.props.setInvitationKey(params[1]);
    }



    render() {
        if (this.props.session.signUp.finished) {
            return <Redirect to={{pathname: '/signIn'}}/>
        }
        if (this.props.session.signUp.invitation_key.length === 0 && this.props.session.signUp.failed) {
            return <div>
                <MainMenu
                    needShowPrivateItems={this.props.session.isAuthenticated}
                    menu={this.props.menu}
                    onLogout={() => {}}
                    setActiveMenuPosition={() => {}}
                />
                <Message warning>
                    <Message.Header>Invalid invitation key</Message.Header>
                    <p>You key is invalid or expired</p>
                </Message>
            </div>
        }

        if (this.props.session.isAuthenticated) {
            return <div>
                <MainMenu
                    needShowPrivateItems={this.props.session.isAuthenticated}
                    menu={this.props.menu}
                    onLogout={this.props.logout}
                    setActiveMenuPosition={() => {}}
                />
                <Message warning>
                    <Message.Header>Cannot apply invitation link</Message.Header>
                    <p>You should logout to use sign up link</p>
                </Message>

            </div>
        }

        return (
            <div>
                <MainMenu
                    needShowPrivateItems={this.props.session.isAuthenticated}
                    menu={this.props.menu}
                    onLogout={() => {}}
                    setActiveMenuPosition={() => {}}
                />
                <SignUp
                    onSubmit={this.submit}
                    session={this.props.session}
                    changePassword={this.props.changePassword}
                    changeRepeatPassword={this.props.changeRepeatPassword}
                    changeFirstName={this.props.changeFirstName}
                    changeLastName={this.props.changeLastName}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
        menu: state.menu
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (params) => {
            signUpAction(params)(dispatch);
        },
        logout: () => {
            logoutAction()(dispatch);
        },
        changePassword: (event, data) => {
            dispatch(changeSignUpPassword(data.value));
        },
        changeRepeatPassword: (event, data) => {
            dispatch(changeSignUpRepeatPassword(data.value));
        },
        changeLastName: (event, data) => {
            dispatch(changeSignUpLastName(data.value));
        },
        changeFirstName: (event, data) => {
            dispatch(changeSignUpFirstName(data.value));
        },
        setInvitationKey: (value) => {
            dispatch(setSignUpInvitationKey(value));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpView);

