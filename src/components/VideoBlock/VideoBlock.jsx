import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import './video.css';

export default class VideoBlock extends Component {
  static propTypes = {
    mod: PropTypes.string,
    url: PropTypes.string,
  }
  static defaultProps = {
    mod: '',
    url: '',
  }
  render() {
    return (
      <div className={`video ${this.props.mod ? this.props.mod : ''}`}>
        <div className="video__player-wrap">
          {
            (this.props.url.indexOf('youtube') > -1 || this.props.url.indexOf('youtu.be') > -1)
              ? <ReactPlayer key={this.props.url} url={this.props.url} width="100%" height="100%" controls className="video__player" />
              : <iframe title="video_component" frameborder="0" allowfullscreen="1" width="100%" height="100%" src={this.props.url} />
          }
        </div>
      </div>
    );
  }
}
