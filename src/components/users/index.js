import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Form, Segment, Button, Dropdown, Dimmer, Loader, Image, Header, Icon, Card } from 'semantic-ui-react';
import ErrorMessage from '../errorMessage';
import { commonConstants } from "../../constants/common";

const genderOptions = [
    { key: 0, text: 'Male', value: 0 },
    { key: 1, text: 'Female', value: 1 }
];

const defaultDetails = [
    "name", "age", "gender", "about", "photos"
];

const detailsBlackList = [
    "filters", "matches", "likes"
];

export default class User extends Component {

    render() {
        if (this.props.users.currentUser._updated) {
            return <Redirect to={
                { pathname: '/users' }}
            />
        }
        console.log({ currentUser: this.props.users.currentUser })
        return (<Segment.Group >
            <Dimmer.Dimmable as={Segment}
                dimmed={this.props.users.loading} >
                <Dimmer active={this.props.users.loading}
                    inverted >
                    <Loader > Loading </Loader> </Dimmer> {
                    this.props.users.error && this.props.users.error.visible &&
                    <ErrorMessage error={this.props.users.error}
                        hideError={this.props.hideError}
                    />
                } <Segment secondary textAlign='center' >
                    <Button onClick={
                        (e, data) => this.props.unblockUser(this.props.users.currentUser.main.id)}
                        size='large'
                        icon='unlock'
                        color='green'
                        disabled={
                            (!!this.props.users.currentUser.main && !this.props.users.currentUser.main.is_blocked)}
                        content='Unblock user' />
                    <Button onClick={
                        (e, data) => this.props.blockUser(this.props.users.currentUser.main.id)}
                        size='large'
                        icon='lock'
                        color='yellow'
                        disabled={
                            (!!this.props.users.currentUser.main && this.props.users.currentUser.main.is_blocked)}
                        content='Block user' />
                    <Button onClick={
                        (e, data) => this.props.removeUserReports(this.props.users.currentUser.main.id)}
                        size='large'
                        icon='trash'
                        color='green'
                        disabled={
                            (!!this.props.users.currentUser.main?.reports)}
                        content='Remove reports' />
                </Segment> <Segment padded >
                    <Form >
                        <Segment secondary >

                            <Form.Input fluid label='Name'
                                placeholder='Name'
                                value={this.props.users.currentUser.main && this.props.users.currentUser.main.display_name ? this.props.users.currentUser.main.display_name : ''}
                                onChange={this.props.changeName}
                            /> <Form.Input fluid label='Email'
                                placeholder='Email'
                                value={this.props.users.currentUser.main && this.props.users.currentUser.main.email ? this.props.users.currentUser.main.email : ''}
                                onChange={this.props.changeEmail}
                                disabled={true}
                            /> <Form.Input fluid label='Phone'
                                placeholder='Phone'
                                value={this.props.users.currentUser.main && this.props.users.currentUser.main.phone ? this.props.users.currentUser.main.phone : ''}
                                disabled={true}
                                onChange={this.props.changePhone}
                            /> <Form.Input fluid label='Disabled'
                                placeholder='Disabled'
                                disabled={true}
                                readOnly={true}
                                value={this.props.users.currentUser.main && this.props.users.currentUser.main.disabled ? 'true' : 'false'}
                            />
                            <Header size='large' > Reports </Header>
                            {!this.props.users.currentUser.main?.reports && <span>No reports</span>}
                            <ReportsList reports={this.props.users.currentUser.main?.reports || []} />
                            <Form.Input fluid label='SignUp date'
                                placeholder='SignUp date'
                                disabled={true}
                                readOnly={true}
                                value={this.props.users.currentUser.main && this.props.users.currentUser.main.sign_up ? (new Date(this.props.users.currentUser.main.sign_up)).toLocaleString() : '-'}
                            /> {
                                this.props.users.currentUser.details && this.props.users.currentUser.details.filters && this.props.users.currentUser.details.filters.location &&
                                <Form.Group widths='equal' >
                                    <Form.Input
                                        fluid
                                        label='Longitude'
                                        placeholder='Longitude'
                                        disabled={false}
                                        readOnly={true}
                                        value={this.props.users.currentUser.details.filters.location.lon || ''}
                                    /> <Form.Input
                                        fluid
                                        label='Latitude'
                                        placeholder='Latitude'
                                        disabled={false}
                                        readOnly={true}
                                        value={this.props.users.currentUser.details.filters.location.lat || ''}
                                    /> </Form.Group>} <Form.Input
                                fluid
                                label='Age'
                                placeholder='Age'
                                type='number'
                                min={18}
                                max={59}
                                value={this.props.users.currentUser.main && this.props.users.currentUser.main.age ? this.props.users.currentUser.main.age : 18}
                                onChange={this.props.changeAge}
                            /> <Form.Select
                                fluid
                                label='Gender'
                                options={genderOptions}
                                placeholder='Gender'
                                onChange={this.props.changeGender}
                                value={this.props.users.currentUser.main?.gender}
                            />

                            <Form.TextArea
                                label='About'
                                placeholder='About'
                                value={this.props.users.currentUser.main?.about}
                                onChange={this.props.changeAbout}
                            /> 
                            {/* This seemed to work earlier but doesn't make any sense now */}
                            {/* <Header size='large' > Additional fields </Header> {
                                this.props.users.currentUser && this.props.users.currentUser.details && Object.keys(this.props.users.currentUser.details).map((key, index) => {
                                    if (defaultDetails.indexOf(key) !== -1) {
                                        return;
                                    }
                                    if (detailsBlackList.indexOf(key) !== -1) {
                                        return;
                                    }
                                    var value = this.props.users.currentUser.details[key];
                                    var type = typeof this.props.users.currentUser.details[key];
                                    switch (type) {
                                        case "string":
                                            return <Form.Input
                                                key={index}
                                                fluid
                                                label={key}
                                                placeholder={key}
                                                readOnly={true}
                                                disabled={key === "fcmToken" || key === "coins"}
                                                value={value}
                                            />
                                        case "number":
                                            return <Form.Input
                                                key={index}
                                                fluid
                                                type='number'
                                                label={key}
                                                placeholder={key}
                                                readOnly={true}
                                                disabled={key === "coins"}
                                                value={value}
                                            />
                                        case "object":
                                            var options = [];
                                            var values = [];
                                            Object.keys(value).map((property, index) => {
                                                options.push({ key: property, text: value[property], value: value[property] });
                                                values.push(value[property]);
                                            });

                                            if (key === 'interestedIn') {
                                                options = commonConstants.INTERESTED_IN_OPTIONS;
                                            }
                                            return <Form.Select
                                                key={index}
                                                fluid
                                                label={key}
                                                placeholder={key}
                                                readOnly={true}
                                                // disabled
                                                multiple selection
                                                options={options}
                                                value={values}
                                            />
                                    }
                                })
                            } */}

                        </Segment>

                        <Segment secondary >
                            <Header size='large' > Photos </Header>
                            <Card.Group >
                                <PhotosList photos={this.props.users.currentUser.main?.avatar_photos || []} />
                            </Card.Group>
                        </Segment>
                        <Segment secondary textAlign='center' >
                            <Link to={"/users/"} >
                                <Button size='large'
                                    content='Cancel' />
                            </Link>
                            <Button
                                size='large'
                                color='blue'
                                content='Save'
                                onClick={
                                    (e, data) => {
                                        e.preventDefault();
                                        this.props.saveUser(this.props.users.currentUser)
                                    }}
                            /> </Segment>

                    </Form> </Segment> </Dimmer.Dimmable> </Segment.Group>
        )
    }
}


const PhotosList = ({ photos }) => {
    const list = photos.map(ph => <img src={ph.file || ph.file_url} width={200} height={200} />)
    return <>
        {list}
    </>
}

const ReportsList = ({ reports }) => {
    const list = reports.map(r => <div>{r.reason}</div>)
    return <>{list}</>
}