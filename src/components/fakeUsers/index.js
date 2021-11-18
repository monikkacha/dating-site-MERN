import React, { Component } from 'react';
import { Button, Segment, Dimmer, Loader, Form, Header, Image, Card, Input, Grid } from 'semantic-ui-react';
import ErrorMessage from "../errorMessage";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Tags from "./tagsComponent";
import { commonConstants } from "../../constants/common"
import AddNewPhoto from "../imageUpload/addNewPhoto";

const requiredFields = [
    { field: "fullName", validateFn: (value) => value.length > 0 },
    { field: "age", validateFn: (value) => !!value },
    { field: "gender", validateFn: (value) => !!value },
    // { field: "photos", validateFn: (value) => value.length > 0 }
];

export default class FakeUser extends Component {

    state = { isDirty: false };

    saveUser = (workerId, currentUser) => {
        this.setState({ isDirty: true });
        if (!this.validate(currentUser)) {
            return
        }
        if (currentUser.id) {
            this.props.updateUser(workerId, currentUser.id, currentUser);
            this.setState({ isDirty: false });
            return;
        }
        let { name, lastName = '', age = 18 } = currentUser
        name = name.replace(/[^0-9a-z_]/gi, '')
        lastName = lastName.replace(/[^0-9a-z_]/gi, '')
        this.props.createUser({ ...currentUser, email: `${name}${lastName}${age}@i69app.com`, display_name: `${name}_${lastName}_${age}`, username: `${name}_${lastName}_${age}` });
        this.setState({ isDirty: false });
    };

    validate = (user) => {
        const form_valid = requiredFields.every((item, index) => item.validateFn(user[item.field]))
        console.log({ form_valid, requiredFields: requiredFields.map((item, index) => item.validateFn(user[item.field])) })
        return form_valid;
    };

    render() {

        let genderOptions = [];
        let ethnicityOptions = [];
        let zodiacSignsOptions = [];
        let familyOptions = [];
        let politicsOptions = [];
        let religiousOptions = [];
        let tagsOptions = [];
        let ageOptions = [];
        let heightOptions = [];

        if (this.props.fakeUsers.presets) {
            const presets = this.props.fakeUsers.presets
            ageOptions = presets.ages.map((item, index) => ({ key: index, value: item.id, text: item.age }))
            heightOptions = presets.heights.map((item, index) => ({ key: index, value: item.id, text: item.height }))
            genderOptions = presets.genders.map((item, index) => ({ key: index, value: item.id, text: item.gender }));
            ethnicityOptions = presets.ethnicity.map((item, index) => ({ key: index, value: item.id, text: item.ethnicity }));
            zodiacSignsOptions = presets.zodiacSigns.map((item, index) => ({ key: index, value: item.id, text: item.zodiacSign }));
            familyOptions = presets.family.map((item, index) => { return { key: index, value: item.id, text: item.familyPlans } });
            politicsOptions = presets.politics.map((item, index) => { return { key: index, value: item.id, text: item.politics } });
            religiousOptions = presets.religious.map((item, index) => { return { key: index, value: item.id, text: item.religious } });
            tagsOptions = presets.tags.map((item, index) => { return { key: index, value: item.id, text: item.tag } });
        }


        return (
            <Segment.Group>
                <Dimmer.Dimmable as={Segment} dimmed={this.props.fakeUsers.loading}>
                    <Dimmer active={this.props.fakeUsers.loading} inverted>
                        <Loader>Loading</Loader>
                    </Dimmer>
                    {
                        this.props.fakeUsers.error && this.props.fakeUsers.error.visible &&
                        <ErrorMessage error={this.props.fakeUsers.error} hideError={this.props.hideError} />
                    }
                    <Segment
                        inverted={this.state.isDirty && this.props.fakeUsers.currentUser.avatar_photos.length === 0}
                        tertiary={this.state.isDirty && this.props.fakeUsers.currentUser.avatar_photos.length === 0}
                        secondary={this.state.isDirty && this.props.fakeUsers.currentUser.avatar_photos.length > 0}
                        color={this.state.isDirty && this.props.fakeUsers.currentUser.avatar_photos.length === 0 ? 'red' : 'black'}>
                        <Header size='large' color={this.state.isDirty && this.props.fakeUsers.currentUser.photos.length === 0 ? 'red' : 'black'}>Photos (*)</Header>
                        {this.props.fakeUsers.currentUser?.avatar_photos?.length === 0 && <Header>No photos selected</Header>}
                        <Card.Group itemsPerRow={4} >
                            {
                                this.props.fakeUsers.currentUser?.avatar_photos?.map((image, index) => {
                                    return <Card key={index}>
                                        <Card.Content>
                                            <div className='ui two buttons'>
                                                <Button basic color='red' onClick={(e, data) => { e.preventDefault(); this.props.onRemovePhoto(this.props.fakeUsers.currentUser.id, image); }}>Remove</Button>
                                            </div>
                                        </Card.Content>
                                        <Image src={image.file || image.file_url} centered />
                                    </Card>;
                                })
                            }
                            <Card>
                                <AddNewPhoto onUpload={this.props.onuploadAvatarPhoto} onAdd={this.props.onAddNewPhoto} height={'200px'} header={'Add new image'} folder={this.props.fakeUsers.currentUser.id || 'images'} />
                            </Card>
                        </Card.Group>

                    </Segment>
                    <Segment padded>
                        <Form>
                            <Segment secondary>
                                <Form.Group widths='equal'>
                                    <Form.Input
                                        fluid
                                        label={'Name ' + (requiredFields.some((item, i) => item.field === 'fullName') ? '(*)' : '')}
                                        placeholder='Name'
                                        value={this.props.fakeUsers.currentUser?.fullName || ''}
                                        onChange={this.props.changeName}
                                        error={this.state.isDirty && this.props.fakeUsers.currentUser.name.length === 0}
                                    />
                                    {/* <Form.Input
                                        fluid
                                        label={'Last Name ' + (requiredFields.some((item, i) => item.field === 'lastName') ? '(*)' : '')}
                                        placeholder='Last Name'
                                        value={this.props.fakeUsers.currentUser?.last_name || ''}
                                        onChange={this.props.changeLastName}
                                    /> */}
                                    <Form.Input
                                        fluid
                                        label={'Work ' + (requiredFields.some((item, i) => item.field === 'work') ? '(*)' : '')}
                                        placeholder='Work'
                                        value={this.props.fakeUsers.currentUser?.work || ''}
                                        onChange={this.props.changeWork}
                                    />
                                    <Form.Input
                                        fluid
                                        label={'Education ' + (requiredFields.some((item, i) => item.field === 'education') ? '(*)' : '')}
                                        placeholder='Education'
                                        value={this.props.fakeUsers.currentUser?.education || ''}
                                        onChange={this.props.changeEducation}
                                    />
                                </Form.Group>
                                <Form.Group widths='equal'>


                                    {/* <Form.Input
                                        fluid
                                        label={'Age ' + (requiredFields.some((item, i) => item.field === 'age') ? '(*)' : '')}
                                        placeholder='Age'
                                        type='number'
                                        min={18}
                                        max={59}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.age ? this.props.fakeUsers.currentUser.age : 18}
                                        onChange={this.props.changeAge}
                                        error={this.state.isDirty && this.props.fakeUsers.currentUser.age === 0}
                                    /> */}
                                    <Form.Select
                                        fluid
                                        search
                                        selection
                                        label="Age"
                                        placeholder="Age"
                                        options={ageOptions}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.age ? this.props.fakeUsers.currentUser.age : 18}
                                        onChange={this.props.changeAge}
                                        error={this.state.isDirty && this.props.fakeUsers.currentUser.age === 0}
                                    />

                                    <Form.Select
                                        fluid
                                        search
                                        selection
                                        label={'Gender ' + (requiredFields.some((item, i) => item.field === 'gender') ? '(*)' : '')}
                                        options={genderOptions}
                                        placeholder='Gender'
                                        onChange={this.props.changeGender}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.gender ? this.props.fakeUsers.currentUser.gender : ''}
                                        error={this.state.isDirty && this.props.fakeUsers.currentUser.gender.length === 0}
                                    />

                                    {/* <Form.Input
                                        fluid
                                        label={'Height ' + (requiredFields.some((item, i) => item.field === 'height') ? '(*)' : '')}
                                        placeholder='Height'
                                        type='number'
                                        min={140}
                                        max={247}
                                        onChange={this.props.changeHeight}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.height ? this.props.fakeUsers.currentUser.height : 140} /> */}

                                    <Form.Select
                                        fluid
                                        search
                                        label="Height"
                                        options={heightOptions}
                                        placeholder="Height"
                                        onChange={this.props.changeHeight}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.height ? this.props.fakeUsers.currentUser.height : 140}
                                    />

                                    <Form.Select
                                        fluid
                                        search
                                        selection
                                        label={'Ethnicity ' + (requiredFields.some((item, i) => item.field === 'ethnicity') ? '(*)' : '')}
                                        options={ethnicityOptions}
                                        placeholder='Ethnicity'
                                        onChange={this.props.changeEthnicity}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.ethnicity ? this.props.fakeUsers.currentUser.ethnicity : ''} />

                                </Form.Group>
                                <Form.Group widths='equal'>

                                    <Form.Select
                                        fluid
                                        search
                                        selection
                                        label={'Zodiac Sign ' + (requiredFields.some((item, i) => item.field === 'zodiacSign') ? '(*)' : '')}
                                        options={zodiacSignsOptions}
                                        placeholder='Zodiac Sign'
                                        onChange={this.props.changeZodiacSign}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.zodiacSign ? this.props.fakeUsers.currentUser.zodiacSign : ''} />
                                    <Form.Select
                                        fluid
                                        search
                                        selection
                                        label={'Family plans ' + (requiredFields.some((item, i) => item.field === 'familyPlans') ? '(*)' : '')}
                                        options={familyOptions}
                                        placeholder='Family plans'
                                        onChange={this.props.changeFamilyPlans}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.familyPlans ? this.props.fakeUsers.currentUser.familyPlans : ''} />

                                    <Form.Select
                                        fluid
                                        search
                                        selection
                                        label={'Politics ' + (requiredFields.some((item, i) => item.field === 'politics') ? '(*)' : '')}
                                        options={politicsOptions}
                                        placeholder='Politics'
                                        onChange={this.props.changePolitics}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.politics ? this.props.fakeUsers.currentUser.politics : ''} />


                                    <Form.Select
                                        fluid
                                        search
                                        selection
                                        label={'Religious Beliefs ' + (requiredFields.some((item, i) => item.field === 'religion') ? '(*)' : '')}
                                        options={religiousOptions}
                                        placeholder='Religious Beliefs'
                                        onChange={this.props.changeReligious}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.religion ? this.props.fakeUsers.currentUser.religion : ''} />

                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Select
                                        fluid
                                        label={'Interested In ' + (requiredFields.some((item, i) => item.field === 'interestedIn') ? '(*)' : '')}
                                        multiple
                                        search
                                        selection
                                        options={commonConstants.INTERESTED_IN_OPTIONS}
                                        placeholder='Interested In'
                                        onChange={this.props.changeInterestedIn}
                                        value={this.props.fakeUsers.currentUser.interestedIn}
                                    />

                                    <Form.Select
                                        fluid
                                        label={'Tags ' + (requiredFields.some((item, i) => item.field === 'tags') ? '(*)' : '')}
                                        multiple
                                        search
                                        selection
                                        options={tagsOptions}
                                        placeholder='Tags'
                                        onChange={this.props.changeTags}
                                        value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.tags ? this.props.fakeUsers.currentUser.tags : ''} />


                                </Form.Group>

                                <Form.TextArea
                                    label={'About ' + (requiredFields.some((item, i) => item.field === 'about') ? '(*)' : '')}
                                    placeholder='About'
                                    value={this.props.fakeUsers.currentUser && this.props.fakeUsers.currentUser.about ? this.props.fakeUsers.currentUser.about : ''}
                                    onChange={this.props.changeAbout}
                                />

                                <Header size='large'>Additional fields</Header>

                                <Grid columns='equal'>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Tags
                                                isRequired={requiredFields.some((item, i) => item.field === 'books')}
                                                tags={this.props.fakeUsers.currentUser.books}
                                                item='book'
                                                type={commonConstants.BOOK_ITEM}
                                                header='Books'
                                                onChangeTag={this.props.onChangeItem}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Tags
                                                isRequired={requiredFields.some((item, i) => item.field === 'music')}
                                                tags={this.props.fakeUsers.currentUser.music}
                                                item='music'
                                                type={commonConstants.MUSIC_ITEM}
                                                header='Music'
                                                onChangeTag={this.props.onChangeItem}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Tags
                                                isRequired={requiredFields.some((item, i) => item.field === 'movies')}
                                                tags={this.props.fakeUsers.currentUser.movies}
                                                item='movie'
                                                type={commonConstants.MOVIE_ITEM}
                                                header='Movies'
                                                onChangeTag={this.props.onChangeItem}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Tags
                                                isRequired={requiredFields.some((item, i) => item.field === 'tvShows')}
                                                tags={this.props.fakeUsers.currentUser.tvShows}
                                                item='TV show'
                                                type={commonConstants.TV_SHOW_ITEM}
                                                header='TV Shows'
                                                onChangeTag={this.props.onChangeItem}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Tags
                                                isRequired={requiredFields.some((item, i) => item.field === 'sportsTeams')}
                                                tags={this.props.fakeUsers.currentUser.sportsTeams}
                                                item='team'
                                                type={commonConstants.SPORT_TEAM_ITEM}
                                                header='Sports Teams'
                                                onChangeTag={this.props.onChangeItem}
                                            />
                                        </Grid.Column>
                                        <Grid.Column>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Segment>
                            <Segment secondary textAlign='center'>
                                <Link to={"/dashboard"}>
                                    <Button size='large' content='Cancel' />
                                </Link>
                                <Button
                                    size='large'
                                    color='blue'
                                    content='Save'
                                    onClick={(e, data) => {
                                        e.preventDefault();
                                        this.saveUser(this.props.fakeUsers.workerId, this.props.fakeUsers.currentUser);
                                    }}
                                />
                            </Segment>

                        </Form>
                    </Segment>
                </Dimmer.Dimmable>
            </Segment.Group>
        )
    }
}

FakeUser.propTypes = {
    fakeUsers: PropTypes.shape({
        loading: PropTypes.bool,
        error: PropTypes.shape({
            visible: PropTypes.bool
        }),
        currentUser: PropTypes.shape({
            name: PropTypes.string.isRequired,
            lastName: PropTypes.string,
            work: PropTypes.string,
            education: PropTypes.string,
            age: PropTypes.number.isRequired,
            gender: PropTypes.string.isRequired,
            height: PropTypes.number,
            ethnicity: PropTypes.string,
            zodiacSign: PropTypes.string,
            familyPlans: PropTypes.string,
            politics: PropTypes.string,
            religion: PropTypes.string,
            tags: PropTypes.array,
            interestedIn: PropTypes.array,
            books: PropTypes.array,
            movies: PropTypes.array,
            music: PropTypes.array,
            tvShows: PropTypes.array,
            sportsTeams: PropTypes.array,
        }).isRequired
    }).isRequired,
    onChangeItem: PropTypes.func.isRequired,
    onAddNewPhoto: PropTypes.func.isRequired,
    onRemovePhoto: PropTypes.func.isRequired,
    changeName: PropTypes.func.isRequired,
    changeLastName: PropTypes.func.isRequired,
    changeGender: PropTypes.func.isRequired,
    changeAbout: PropTypes.func.isRequired,
    changeAge: PropTypes.func.isRequired,
    changeTags: PropTypes.func.isRequired,
    changeInterestedIn: PropTypes.func.isRequired,
    changePolitics: PropTypes.func.isRequired,
    changeReligious: PropTypes.func.isRequired,
    changeFamilyPlans: PropTypes.func.isRequired,
    changeZodiacSign: PropTypes.func.isRequired,
    changeHeight: PropTypes.func.isRequired,
    changeEducation: PropTypes.func.isRequired,
    changeEthnicity: PropTypes.func.isRequired,
    changeWork: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
};
