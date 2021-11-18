import React, { Component } from 'react';
import { Icon, Header, Grid, Button, Popup } from 'semantic-ui-react';

export default class ConfirmationPopup extends Component {
    state = { isConfirmPopupOpen: false };

    handleConfirmPopupOpen = () => {
        this.setState({ isConfirmPopupOpen: true });
    };

    handleConfirmPopupClose = () => {
        this.setState({ isConfirmPopupOpen: false });
    };

    render() {
        return (
            <Popup
                trigger={this.props.icon || <Icon link color="black" size="large" name="trash"/>}
                inverted
                onOpen={this.handleConfirmPopupOpen}
                open={this.state.isConfirmPopupOpen}
                onClose={this.handleConfirmPopupClose}
                position='bottom right'
                on="click"
            >
                <Grid>
                    <Grid.Column>
                        <Header textAlign='center' as='h4'>{this.props.confirmationText}</Header>
                        <Button.Group fluid>
                            <Button color='grey' onClick={this.handleConfirmPopupClose}>{this.props.successDiscardButtonText || "Cancel"}</Button>
                            <Button color="red"
                                    onClick={
                                        (e) => {
                                            this.handleConfirmPopupClose();
                                            this.props.onSuccessConfirm(e, this.props.entityData)
                                        }
                                    }>{this.props.successConfirmButtonText || "Remove"}</Button>
                        </Button.Group>
                    </Grid.Column>
                </Grid>
            </Popup>
        )
    }
}
