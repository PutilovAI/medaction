import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

import * as EmailActions from '../../actions/EmailActions';

import { Checkbox } from '../../components/Input/InputComponents';
import Button from '../Button/Button';
import { lang } from '../../assets/js/lang';

import './login.css';

class LoginEmail extends Component {
  static propTypes = {
    className: PropTypes.string,
    actions: PropTypes.shape({
      reSendEmail: PropTypes.func,
      verifyEmailCancel: PropTypes.func,
    }),
    resendEmailSuccess: PropTypes.bool,
    resendEmailError: PropTypes.bool,
    resendEmailLoading: PropTypes.bool,
    children: PropTypes.element,
  };

  static defaultProps = {
    className: '',
    actions: {
      reSendEmail: () => {},
      verifyEmailCancel: () => {},
    },
    resendEmailSuccess: false,
    resendEmailError: false,
    resendEmailLoading: false,
    children: null,
  };

  componentWillUnmount() {
    this.props.actions.verifyEmailCancel();
  }

  @autobind
  agreement() {
    if (this.props.agreementClick) {
      this.props.agreementClick();
    }
  }

  @autobind
  handlerOnSend(e) {
    if (!this.agree_check.state.checked) {
      this.agree_check_error.style.display = 'block';
      return false;
    }

    this.props.actions.reSendEmail({});
    return true;
  }
  render() {
    let contentToRender = null;

    if (this.props.resendEmailSuccess) {
      contentToRender = (<div className={`login-email ${this.props.className ? this.props.className : ''}`}>
        <p className="login-email__title" dangerouslySetInnerHTML={{ __html: lang('forms', 'verifyEmailSendSuccessTitle') }} />
        <p className="login-email__description" dangerouslySetInnerHTML={{ __html: lang('forms', 'verifyEmailSendSuccessDescription') }} />
        {this.props.children}
      </div>);
    } else {
      contentToRender = (<div className={`login-email ${this.props.className ? this.props.className : ''}`}>
        <p className="login-email__title" dangerouslySetInnerHTML={{ __html: lang('forms', 'reSendEmailTitle') }} />
        <p className="login-email__description" dangerouslySetInnerHTML={{ __html: lang('forms', 'reSendEmailDescription') }} />
        <Checkbox
          id="agree_check"
          ref={(c) => { this.agree_check = c; }}
          defaultChecked={false}
          onChange={this.handleOnChangeCheckbox}
        >
          <span className="input__label-text">Проставляя отметку, я&nbsp;даю свое <span role="button" className="link" tabIndex={-1} onClick={this.agreement}>согласие</span> на&nbsp;обработку моих <a href='/static-pages/personal-information' target='_blank'>персональных данных</a> в&nbsp;соответствии с&nbsp;Федеральным законом от&nbsp;27.07.2006 года &#8470;&nbsp;152-ФЗ &laquo;О&nbsp;персональных данных&raquo; и&nbsp;получение информационных рассылок</span>
        </Checkbox>
        <div className="input__error input__checkbox-error" style={{ display: 'none' }} ref={(c) => { this.agree_check_error = c; }}>Согласитесь с правилами сайта</div>
        <Button
          className=""
          text={lang('forms', 'confirm')}
          onClick={this.handlerOnSend}
        />
        {this.props.children}
      </div>);
    }

    return (<div>
      {contentToRender}
    </div>);
  }
}

function mapStateToProps(state) {
  return {
    resendEmailSuccess: state.app.resendEmailSuccess,
    resendEmailError: state.app.resendEmailError,
    resendEmailLoading: state.app.resendEmailLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...EmailActions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginEmail);
