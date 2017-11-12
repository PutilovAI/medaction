import React from 'react';
import { Route } from 'react-router';

import Menu from '../components/Menu/Menu';

const LayoutLogin = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (
        <div className="wrapper__page wrapper__page_nomenu wrapper__bg">
          <div className="wrapper__page-top">
            <Menu />
            <div className="wrapper__content">
              <Component {...props} />
            </div>
          </div>
        </div>
      )}
    />
  );
};

export default LayoutLogin;
