import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { loginAction, changePassword, changeEmail } from '../../actions/session';

import MainMenu from '../../components/mainMenu';
import SignIn from '../../components/auth/signIn';
// import audioSrc from "../../../media/Ring.wav";

class SignInView extends Component {

    submitLogin = () => {

        // let audioFileName;
        // console.log(audioSrc)
        // let sound = new Audio(audioSrc);
        // sound.play();


        var credentials = {
            email: this.props.session.email,
            password: this.props.session.password
        };
        this.props.login(credentials);
    };

    render() {
        const {from} = this.props.location.state || {from: {pathname: '/dashboard'}};

        if (this.props.session.isAuthenticated) {
            return <Redirect to={from}/>
        }

        return (
            <div>
                <MainMenu
                    needShowPrivateItems={this.props.session.isAuthenticated}
                    menu={this.props.menu}
                    onLogout={() => {}}
                    setActiveMenuPosition={() => {}}
                />
                <SignIn
                    onSubmit={this.submitLogin}
                    session={this.props.session}
                    changePassword={this.props.changePassword}
                    changeEmail={this.props.changeEmail}
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
        login: (credentials) => {
            loginAction(credentials)(dispatch);
        },
        changePassword: (event, data) => {
            dispatch(changePassword(data.value));
        },
        changeEmail: (event, data) => {
            dispatch(changeEmail(data.value));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInView);

