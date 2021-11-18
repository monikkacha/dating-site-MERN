import {Component} from "react";
import {Button, Divider, Header, Label, Segment, Form} from "semantic-ui-react";
import React from "react";
import PropTypes from "prop-types";
import {commonConstants} from "../../constants/common";

export default class Tags extends Component {
    state = {currentValue: ''};

    onChangeCurrentValue = (e, data) => {
        this.setState({
            currentValue: data.value
        });
    };

    onAddTag = () => {
        const newItem = this.state.currentValue;
        this.setState({
            currentValue: ''
        });
        this.props.onChangeTag(newItem, this.props.type, commonConstants.ACTION_ADD);
    };

    onRemoveTag = (item) => {
        this.props.onChangeTag(item, this.props.type, commonConstants.ACTION_REMOVE);
    };
    render() {
        return (
            <Segment secondary={false}>
                <Header as={'h4'} content={this.props.header + (this.props.isRequired ? ' (*)' : '')}/>
                {
                    this.props.tags && this.props.tags.map((item, index) => {
                        return <Label key={index} onRemove={() => this.onRemoveTag(item)} content={item} />;
                    })
                }
                {
                    this.props.tags && this.props.tags.length === 0 && <p>
                        No items added
                    </p>
                }
                {
                    !this.props.tags && <p>
                        No items added
                    </p>
                }
                <Divider/>
                <Form.Input
                    fluid
                    label={'Add ' + (this.props.item)}
                    icon='tags'
                    iconPosition='left'
                    action={<Button onClick={(e,data) => { e.preventDefault(); this.onAddTag(); }}>Add {this.props.item}</Button>}
                    placeholder={'Enter ' + (this.props.item)}
                    value={this.state.currentValue}
                    onChange={this.onChangeCurrentValue}
                />


            </Segment>
        )
    }
}

Tags.defaultProps = {
    item: 'Tag',
    header: 'Tags',
    isRequired: false
};

Tags.propTypes = {
    isRequired: PropTypes.bool,
    tags: PropTypes.array.isRequired,
    header: PropTypes.string,
    type: PropTypes.string,
    item: PropTypes.string,
    onChangeTag: PropTypes.func.isRequired
};
