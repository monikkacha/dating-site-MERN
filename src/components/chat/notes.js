import {Button, Form, Grid, Loader} from "semantic-ui-react";
import React, {Component} from "react";

export default class Notes extends Component {


    constructor(props) {
        super(props);
        this.state = {newValue: this.props.value, oldValue: this.props.value, loading: false};
    }

    changeValue = (e, data) => {
        this.setState({newValue: data.value});
    };

    saveValue = () => {
        this.setState({loading: true});
        this.props.saveValue(
            this.props.id,
            this.state.newValue
        )
    };

    componentWillReceiveProps(props) {
        if (props.value !== this.state.oldValue) {
            this.setState({newValue: props.value || '', oldValue: props.value || '', loading: false});
        }
    }


    render() {
        const disabled = this.state.newValue === this.state.oldValue;
        return (
            <Form reply>
                <Loader active={this.state.loading}/>
                <Grid columns={2}>
                    <Grid.Column width={14}>
                        <Form.TextArea rows={2} value={this.state.newValue} onChange={this.changeValue} disabled={this.state.loading}/>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Button
                            content='Save notes'
                            primary
                            //chatId, value
                            onClick={(e) => {
                                e.preventDefault();
                                this.saveValue();
                            }}
                            disabled={disabled || this.state.loading}/>
                    </Grid.Column>
                </Grid>
            </Form>)
    }
}
