import React, { Component } from "react";
import storage from "../../utils/Firebase";
import Photo from "./photo";
import { Button, Grid, Loader, Icon } from "semantic-ui-react";

class ImageUpload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: null,
            src: '',
            progress: 0,
            isValid: false,
            loading: false
        };
    }

    setUrl = url => {
        this.setState({ image: null, src: url });
    };

    selectImage = e => {
        this.inputRef.click();
    };

    onAdd = (newItem) => {
        this.props.onAdd(newItem);
    };


    handleChange = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({ image }));
            generatePreviewImgUrl(image, previewImgUrl => {
                // (assuming we use React)
                this.setState({ src: previewImgUrl })
            })
        }
    };

    reset = () => {
        this.setState({ image: null, src: '', progress: 0, isValid: false, loading: false });
    };

    onLoad = () => {
        this.setState({
            isValid: true,
            loading: false
        });
    };

    onError = () => {
        this.setState({
            isValid: false,
            loading: false
        });
    };

    handleUpload = () => {
        this.setState({
            loading: true
        });
        const { image } = this.state;
        const { folder } = this.props;
        const imageName = generateString(29) + '.jpg';
        const fileParams = {
            name: imageName,
            file: image,
            type: image.type,
            size: image.size,
            public: false
        }
        this.props.onUpload(fileParams)

        // const uploadTask = storage.ref(`${folder}/${imageName}`).put(image);
        // uploadTask.on(
        //     "state_changed",
        //     snapshot => {
        //         // progress function ...
        //         const progress = Math.round(
        //             (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        //         );
        //         this.setState({ progress });
        //     },
        //     error => {
        //         // Error function ...
        //         console.log(error);
        //         this.props.onError();
        //     },
        //     () => {
        //         // complete function ...
        //         storage
        //             .ref(folder)
        //             .child(imageName)
        //             .getDownloadURL()
        //             .then(url => {
        //                 this.onAdd(url);
        //                 this.reset();
        //             });
        //     }
        // );
    };

    render() {
        return (
            <div>
                <Loader active={this.state.loading} />
                <input type="file" onChange={this.handleChange} style={{ display: "none" }} ref={input => this.inputRef = input} />

                <Grid textAlign='center'>
                    <Grid.Row>
                        <Photo
                            height={this.props.height}
                            src={(this.state.src !== '' ? this.state.src : '')}
                            onLoad={this.onLoad}
                            onError={this.onError}
                            onClick={this.props.disabled ? () => { } : this.selectImage}
                            disabled={this.props.disabled}
                        />
                        {this.state.src !== '' && <Icon link corner name={'close'} onClick={this.reset} />}

                    </Grid.Row>
                    <Grid.Row>
                        <Button
                            disabled={!this.state.isValid || this.props.disabled}
                            color='blue'
                            content={this.props.header}
                            onClick={(e, data) => { e.preventDefault(); this.handleUpload() }}
                        />
                    </Grid.Row>
                </Grid>

            </div>
        );
    }
}

export default ImageUpload;

function generatePreviewImgUrl(file, callback) {
    const reader = new FileReader();
    const url = reader.readAsDataURL(file);
    reader.onloadend = e => callback(reader.result);
}

function generateString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
