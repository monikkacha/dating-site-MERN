import React, { Component } from 'react';
import { Icon, Message } from 'semantic-ui-react';

export default class ErrorMessage extends Component {

    render() {
        return (
            <Message
                onDismiss={this.props.hideError}
                error
                header={this.props.error.header === '' ? 'Error occurred when process this operation' : this.props.error.header}
                list={this.props.error.messages && this.props.error.messages.length > 0 ? this.props.error.messages : []}
                />
        )
    }
}
