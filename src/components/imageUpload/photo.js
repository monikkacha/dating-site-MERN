import React, { Component } from 'react';
import PropTypes from 'prop-types';
import image from '../../assets/images/image.png';

export default class Photo extends Component {

    constructor(props) {
        super(props);
        this.state = {isError: false};
    }
    onLoad = (e) => {
        this.setState({
            isError: false
        });
        console.log('on load');
        if (this.props.onLoad) {
            this.props.onLoad();
        }
    };
    onError = (e) => {
        this.setState({
            isError: true
        });
        console.log('on error');
        if (this.props.onError) {
            this.props.onError();
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.src !== this.props.src) {
            this.setState({ isError: false });
        }
    }

    render() {
        const { src } = this.props;
        if (src === '') {
            return <img
                style={{height:this.props.height, maxHeight:this.props.height}}
                src={image}
                height={this.props.height}
                onClick={this.props.onClick}
            />
        }
        if (this.state.isError) {
            return <img
                src={image}
                style={{height:this.props.height}}
                height={this.props.height}
                onClick={this.props.onClick}
            />
        }
        return (
            <img
                src={src}
                style={{height:this.props.height}}
                height={this.props.height}
                onError={this.onError}
                onLoad={this.onLoad}
                onClick={this.props.onClick}
            />
        );
    }
}

Image.defaultProps = {
    height: '100px'
};

Image.propTypes = {
    src: PropTypes.string.isRequired,
    height: PropTypes.number,
    onError: PropTypes.func,
    onLoad: PropTypes.func
};
