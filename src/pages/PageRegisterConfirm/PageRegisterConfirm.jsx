import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as queryString from 'query-string';

import * as RegisterActions from '../../actions/RegisterActions';
// import * as C from 'constants/app';


import './page-register-confirm.css';

export class PageRegister extends Component {
  componentWillMount() {
    const confirmData = {};
    const query = queryString.parse(this.props.location.search);
    const { token = false, uid = false } = query;

    if (!token || !uid) {
      this.props.history.push('/');
    }

    confirmData.token = token;
    confirmData.uid = uid;
    this.props.actions.registerConfirmSendToken(confirmData);
  }

  render() {
    return (
      <div className="page-register-confirm">
        <section className="section">
          <div className="container">
            <h1 className="page-register-confirm__page-title">Подтверждение регистрации</h1>
          </div>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fields: state.registerForm.fields,
    fieldsErrors: state.registerForm.fieldsErrors,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...RegisterActions }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageRegister);
