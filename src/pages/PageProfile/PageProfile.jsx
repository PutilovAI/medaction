import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import dcopy from 'deep-copy';
import { autobind } from 'core-decorators';

import Profile from '../../components/Profile/Profile';
import Errors from '../../components/Errors/Errors';

import * as ProfileActions from '../../actions/ProfileActions';
import * as AppActions from '../../actions/AppActions';
import * as ArticleActions from '../../actions/ArticleActions';
import * as RegisterActions from '../../actions/RegisterActions';
import * as ActivityActions from '../../actions/ActivityAction';
import CheckUserAccess from '../../components/CheckUserAccess/CheckUserAccess';
import Page404 from '../Page404/Page404';
import './page-profile.css';

class PageProfile extends Component {
  static propTypes = {
    articlesList: PropTypes.oneOfType([
      PropTypes.shape({
        results: PropTypes.arrayOf(
          PropTypes.object,
        ),
      }),
      PropTypes.bool,
    ]),
    reminders: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    remindersLoading: PropTypes.bool,
    remindersError: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    actions: PropTypes.shape({
      userPostLogout: PropTypes.func,
      receiveProfileId: PropTypes.func,
      userProfileUpdate: PropTypes.func,
      profileChangePhoto: PropTypes.func,
      receiveProfile: PropTypes.func,
      userUpdate: PropTypes.func,
      getArticles: PropTypes.func,
      getSummary: PropTypes.func,
      resetProfile: PropTypes.func,
      editSendForm: PropTypes.func,
      getReminders: PropTypes.func,
      remindersPatch: PropTypes.func,
    }),
    match: PropTypes.shape({
      isExact: PropTypes.bool,
      params: PropTypes.shape({
        type: PropTypes.string,
      }),
      path: PropTypes.string,
      url: PropTypes.string,
    }),
    profileUser: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    profileUserError: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    profileUserErrorStatus: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
      PropTypes.number,
    ]),
    curUser: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool,
    ]),
    isUserInit: PropTypes.bool,
    history: PropTypes.shape({
      push: PropTypes.function,
    }),
    summary: PropTypes.oneOfType([
      PropTypes.shape({}),
      PropTypes.bool,
    ]),
  };

  static defaultProps = {
    articlesList: false,
    reminders: false,
    remindersLoading: false,
    remindersError: false,
    actions: {
      userPostLogout: () => {},
      receiveProfileId: () => {},
      userProfileUpdate: () => {},
      profileChangePhoto: () => {},
      receiveProfile: () => {},
      userUpdate: () => {},
      getSummary: () => {},
      getArticles: () => {},
      resetProfile: () => {},
      editSendForm: () => {},
      getReminders: () => {},
      remindersPatch: () => {},
    },
    match: {
      params: {
        type: '',
      },
    },
    profileUser: false,
    profileUserError: false,
    curUser: false,
    isUserInit: false,
    history: {},
    summary: false,
    profileUserErrorStatus: false,
  };

  componentWillMount() {
    this.recieveProfile(this.props);
  }

  componentDidMount() {
    const {
      match: {
        params: {
          id = false,
        },
      },
    } = this.props;

    // если мы не авторизованы, то переходим на авторизацию
    if (this.props.isUserInit && (!this.props.curUser.id || (id && id !== this.props.curUser.id))) {
      CheckUserAccess(this.props.curUser, this.props.history, this.props.location);
    }

    if (!this.props.remindersLoading) {
      this.props.actions.getReminders();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: {
          id = false,
        },
      },
    } = nextProps;

    // если мы не авторизованы, то переходим на авторизацию
    if (nextProps.isUserInit && (!nextProps.curUser.id || (id && id !== this.props.curUser.id))) {
      CheckUserAccess(nextProps.curUser, nextProps.history, nextProps.location);
    }

    // если еще не запрашивали напоминания
    if (!nextProps.remindersLoading && !nextProps.reminders && !nextProps.remindersError) {
      this.props.actions.getReminders();
    }

    // если изменился path, но остались на пользователе,
    // значит надо перезапросить инфу о пользователе
    if (this.props.match && nextProps.match && this.props.match.path !== nextProps.match.path) {
      this.recieveProfile(nextProps);
    }

    // if (this.props.curUser && nextProps.profileUser &&
    //   this.props.curUser.id === nextProps.profileUser.id) {
    //   this.props.actions.getSummary();
    // } else if (this.props.curUser && nextProps.profileUser &&
    //   this.props.curUser.id !== nextProps.profileUser.id) {
    //   this.props.actions.getArticles({ user: 103 });
    // }

    // if (this.props.curUser && nextProps.profileUser &&
    //   this.props.curUser.id === nextProps.profileUser.id) {
    //   // this.props.actions.getSummary();
    // } else if (this.props.articlesList && this.props.articlesList !== nextProps.articlesList) {
    //   // this.props.actions.getArticles({ user: 103 });
    // }
  }

  componentWillUnmount() {
    this.props.actions.resetProfile();
  }

  favoritesPatch = (data, type, id) => {
    this.props.actions.remindersPatch(data, type, id, () => {
      this.props.actions.getReminders();
    });
  }

  recieveProfile = (props) => {
    const {
      match: {
        params: {
          id = false,
        },
      },
    } = props;
    if (typeof id !== 'undefined' && !isNaN(parseInt(id))) {
      this.props.actions.receiveProfileId(id);
      this.props.actions.getArticles({ user: id });
    } else {
      this.props.actions.receiveProfile();
      this.props.actions.getSummary();
    }
  }

  @autobind
  userChangePhotoSuccess(newPhotoUrl) {
    const newUser = dcopy(this.props.curUser);
    const newUserProfile = dcopy(this.props.profileUser);

    newUser.avatar = newPhotoUrl;
    newUserProfile.avatar = newPhotoUrl;

    this.props.actions.userUpdate(newUser);
    this.props.actions.userProfileUpdate(newUserProfile);
  }

  @autobind
  profileChangePhoto(photo) {
    this.props.actions.profileChangePhoto(photo, this.userChangePhotoSuccess);
  }

  @autobind
  userLogout() {
    this.props.actions.userPostLogout();
    this.props.history.push('/');
  }

  render() {
    if (this.props.profileUserErrorStatus === 404) {
      return <Page404 />;
    }

    const {
      match: {
        path = '',
      },
      curUser: {
        id: curUserId = null,
      },
      isUserInit = false,
      profileUserError = false,
    } = this.props;

    // если пользователь еще не идентифицировался
    // можем показать прелоадер к примеру
    if (!isUserInit) {
      return null;
    }

    let profileUser = this.props.profileUser;

    // если нет профайл-юзера
    if (isUserInit && !profileUser) {
      profileUser = this.props.curUser;
    }

    let profileComp = null;

    profileComp = (<Profile
      remindersPatch={this.favoritesPatch}
      user={profileUser}
      profileChangePhoto={this.profileChangePhoto}
      me={curUserId}
      curUser={this.props.curUser}
      logout={this.userLogout}
      summary={this.props.summary}
      articlesList={this.props.articlesList}
      resendEmailSuccess={this.props.resendEmailSuccess}
      editSendForm={this.props.actions.editSendForm}
      reminders={this.props.reminders}
    />);

    return (<div>{ profileComp }</div>);
  }
}
function mapStateToProps(state) {
  return {
    curUser: state.app.user,
    profileUser: state.profile.profileUser,
    profileUserErrorStatus: state.profile.profileUserErrorStatus,
    isUserInit: state.app.isUserInit,
    profileUserError: state.profile.profileUserError,
    resendEmailSuccess: state.app.resendEmailSuccess,
    summary: state.profile.summary,
    articlesList: state.articles.list,
    reminders: state.activity.reminders,
    remindersLoading: state.activity.remindersLoading,
    remindersError: state.activity.remindersFailure,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...ActivityActions,
      ...ProfileActions,
      ...AppActions,
      ...ArticleActions,
      ...RegisterActions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageProfile);
