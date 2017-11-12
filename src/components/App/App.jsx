import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import LoadingBar from 'react-redux-loading-bar';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';

import * as AppActions from '../../actions/AppActions';
import Throbber from '../Throbber/Throbber';
import { handleClick } from '../../assets/js/helpers';


class App extends Component {
  componentWillMount() {
    this.setUserInit(this.props.isUserInit);
    this.props.actions.getAllServices();
  }

  componentDidMount() {
    if (window.location.hash) {
      handleClick(window.location.hash);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isUserInit !== nextProps.isUserInit) {
      this.setUserInit(nextProps.isUserInit);
    }
  }

  // Загружаем данные пользователя при загрузке приложения и проверяем авторизован он или нет
  setUserInit(isUserInit) {
    if (!isUserInit) {
      document.body.style.overflow = 'hidden';
      this.props.actions.userGetProfile();
    } else {
      ReactGA.set({ userId: this.props.user.id });
      document.body.style.overflow = '';
    }
  }

  render() {
    const { isUserInit } = this.props;
    return (
      <div>
        <LoadingBar loading={50} showFastActions className="loading-bar" />
        {this.props.children}
        {/* !isUserInit && (
          <Throbber className="throbber_full" />
        ) */}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    auth: state.app.auth,
    user: state.app.user,
    authErrors: state.app.authErrors,
    isUserInit: state.app.isUserInit,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...AppActions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
  isUserInit: PropTypes.bool,
  children: PropTypes.element,
};

App.defaultProps = {
  isUserInit: false,
  children: null,
};
