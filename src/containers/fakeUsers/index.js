import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import MainMenu from '../../components/mainMenu';
import FakeUser from "../../components/fakeUsers";
import {
    uploadAvatarPhoto,
    changeName,
    changeLastName,
    changeAge,
    changeAbout,
    changeGender,
    onAddImage,
    onRemoveImage,
    changeZodiacSign,
    changeHeight,
    changeFamilyPlans,
    changeEthnicity,
    changeEducation,
    changeInterestedIn,
    changePolitics,
    changeReligious,
    changeWork,
    changeTags,
    createUser,
    updateUser,
    setWorkerId,
    setFakeUserId,
    onChangeItem,
    hideError,
    getPresets,
    getFakeUserDetails,
    resetSettings
} from '../../actions/fakeUsers';
import { setActiveMenuPosition } from '../../actions/menu';
import { logoutAction } from '../../actions/session';


class FakeUserView extends Component {

    componentDidMount() {
        const { workerId, id } = this.props.match.params;
        const isNew = !id;
        this.props.setWorkerId(workerId);

        if (!isNew) {
            this.props.getFakeUserDetails(id);
            this.props.setFakeUserId(id);
        }

        if (!this.props.fakeUsers.presets) {
            this.props.getPresets();
        }
    }

    onuploadAvatarPhoto = (params) => {
        this.props.uploadAvatarPhoto(this.props.fakeUsers.currentUser.id, params)
    }

    render() {
        const { workerId, id } = this.props.match.params;
        if (!this.props.session.isAuthenticated) {
            return <Redirect to={{ pathname: '/signIn', state: { from: this.props.location } }} />
        }
        if (this.props.fakeUsers.workerId === 0) {
            return <div>
                <MainMenu
                    needShowPrivateItems={this.props.session.isAuthenticated}
                    menu={this.props.menu}
                    onLogout={this.props.onLogout}
                    setActiveMenuPosition={this.props.setActiveMenuPosition}
                    userDetails={this.props.session.userDetails}
                />
                <p>Worker ID is required</p>
            </div>
        }
        if (this.props.fakeUsers._isSaved) {
            this.props.resetSettings();
            return <Redirect to={{ pathname: '/dashboard', state: { from: this.props.location } }} push />
        }
        const createUser = this.props.createUser(workerId)
        const updateUser = this.props.updateUser(workerId)
        return (
            <div>
                <MainMenu
                    needShowPrivateItems={this.props.session.isAuthenticated}
                    menu={this.props.menu}
                    onLogout={this.props.onLogout}
                    setActiveMenuPosition={this.props.setActiveMenuPosition}
                    userDetails={this.props.session.userDetails}
                />
                <FakeUser
                    fakeUsers={this.props.fakeUsers}
                    changeName={this.props.changeName}
                    changeLastName={this.props.changeLastName}
                    changeAge={this.props.changeAge}
                    changeGender={this.props.changeGender}
                    changeAbout={this.props.changeAbout}
                    changeEmail={this.props.changeEmail}
                    changePhone={this.props.changePhone}
                    updateUser={updateUser}
                    createUser={createUser}
                    hideError={this.props.hideError}
                    onuploadAvatarPhoto={this.onuploadAvatarPhoto}
                    onChangeItem={this.props.onChangeItem}
                    onAddNewPhoto={this.props.onAddNewPhoto}
                    onRemovePhoto={this.props.onRemovePhoto}
                    changeEducation={this.props.changeEducation}
                    changeEthnicity={this.props.changeEthnicity}
                    changeFamilyPlans={this.props.changeFamilyPlans}
                    changeHeight={this.props.changeHeight}
                    changeInterestedIn={this.props.changeInterestedIn}
                    changePolitics={this.props.changePolitics}
                    changeReligious={this.props.changeReligious}
                    changeTags={this.props.changeTags}
                    changeWork={this.props.changeWork}
                    changeZodiacSign={this.props.changeZodiacSign}
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
        fakeUsers: state.fakeUsers
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        uploadAvatarPhoto: (userId, params) => {
            uploadAvatarPhoto(userId, params)(dispatch)
        },
        setWorkerId: (id) => {
            setWorkerId(id)(dispatch);
        },
        setFakeUserId: (id) => {
            setFakeUserId(id)(dispatch);
        },
        changeName: (e, data) => {
            changeName(data.value)(dispatch);
        },
        changeLastName: (e, data) => {
            changeLastName(data.value)(dispatch);
        },
        changeAge: (e, data) => {
            changeAge(data.value)(dispatch);
        },
        changeGender: (e, data) => {
            changeGender(data.value)(dispatch);
        },
        changeAbout: (e, data) => {
            changeAbout(data.value)(dispatch);
        },
        changeEducation: (e, data) => {
            changeEducation(data.value)(dispatch);
        },
        changeEthnicity: (e, data) => {
            changeEthnicity(data.value)(dispatch);
        },
        changeFamilyPlans: (e, data) => {
            changeFamilyPlans(data.value)(dispatch);
        },
        changeHeight: (e, data) => {
            changeHeight(data.value)(dispatch);
        },
        changePolitics: (e, data) => {
            changePolitics(data.value)(dispatch);
        },
        changeReligious: (e, data) => {
            changeReligious(data.value)(dispatch);
        },
        changeInterestedIn: (e, data) => {
            changeInterestedIn(data.value)(dispatch);
        },
        changeTags: (e, data) => {
            changeTags(data.value)(dispatch);
        },
        changeWork: (e, data) => {
            changeWork(data.value)(dispatch);
        },
        changeZodiacSign: (e, data) => {
            changeZodiacSign(data.value)(dispatch);
        },
        onChangeItem: (item, type, action) => {
            console.log(item, type, action);
            onChangeItem(item, type, action)(dispatch);
        },
        onAddNewPhoto: (item) => {
            onAddImage(item)(dispatch);
        },
        onRemovePhoto: (userId, item) => {
            onRemoveImage(userId, item)(dispatch);
        },
        createUser: workerId => (user) => {
            createUser(workerId, user)(dispatch);
        },
        updateUser: workerId => (workerId, uid, user) => {
            updateUser(workerId, uid, user)(dispatch);
        },
        getFakeUserDetails: (id) => {
            getFakeUserDetails(id)(dispatch);
        },
        hideError: () => {
            hideError()(dispatch);
        },
        getPresets: () => {
            getPresets()(dispatch);
        },
        setActiveMenuPosition(activeMenu) {
            setActiveMenuPosition(activeMenu)(dispatch)
        },
        resetSettings: () => {
            resetSettings()(dispatch);
        },
        onLogout() {
            logoutAction()(dispatch)
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(FakeUserView);

