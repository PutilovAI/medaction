import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import { Input } from '../../components/Input/InputComponents';
import './banner-action.css';

export default class BannerAction extends Component {
  static propTypes = {
    className: PropTypes.string,
    buttonText: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    img: PropTypes.string,
    buttonTo: PropTypes.string,
    contentModifier: PropTypes.string,
    type: PropTypes.number,
    sendInvite: PropTypes.func,
    inviteResult: PropTypes.bool,
    inviteMessage: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    buttonText: '',
    title: '',
    desc: '',
    img: '',
    buttonTo: null,
    contentModifier: '',
    type: 1,
    sendInvite: () => {},
    inviteResult: false,
    inviteMessage: '',
  }

  state = {
    sendInvite: false,
  }

  @autobind
  submitForm(e) {
    e.preventDefault();
    const elements = e.target.elements;
    const data = {
      email: elements.emailForInvitation.value,
      next: '/',
    };
    if (!this.state.invite) {
      this.setState({ invite: true });
      this.props.sendInvite(data);
      setTimeout(() => {
        this.setState({ invite: false });
      }, 10000);
    }
  }

  render() {
    const { className: classMod = '' } = this.props;
    if (this.props.inviteResult) {
      return (
        <div className={`banner-action ${classMod}`} style={{ backgroundImage: `url(${this.props.img})` }} >
          <div className={`banner-action__content ${this.props.contentModifier}`}>
            <div className="banner-action__title">{this.props.title}</div>
            <div className="banner-action__desc">{this.props.inviteMessage}</div>
          </div>
        </div>
      );
    }
    return (
      <div className={`banner-action ${classMod}`} style={{ backgroundImage: `url(${this.props.img})` }} >
        <div className={`banner-action__content ${this.props.contentModifier}`}>
          { this.props.title && <div className="banner-action__title">{this.props.title}</div>}
          { this.props.desc && <div className="banner-action__desc">{this.props.desc}</div>}
          { this.props.type === 2 ?
            <form onSubmit={this.submitForm}>
              <div className="row">
                <div className="col_12">
                  <div className="input input_text">
                    <label className="input__label" htmlFor="resendEmail">
                      <div className="input__label-text">
                        эл.почта
                      </div>
                    </label>
                    <input id="emailForInvitation" className="input__field" name="email" pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$" required />
                  </div>
                </div>
              </div>
              { this.props.buttonText &&
                <Button text={this.props.buttonText} to={this.props.buttonTo} /> }
            </form>
            : '' }
          { this.props.buttonText && this.props.type !== 2 &&
            <Button text={this.props.buttonText} to={this.props.buttonTo} /> }
        </div>
      </div>
    );
  }
}
