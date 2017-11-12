import React from 'react';
import { Route } from 'react-router';

import Footer from '../components/Footer/Footer';

const LayoutLogin = ({ component: Component, ...rest }) => {
  // onUpdate={window.scrollTo(0,0)}
  return (
    <Route
      {...rest}
      render={props => (
        <div className="wrapper__page wrapper__page_nomenu">
          <div className="wrapper__page-top">
            <div className="wrapper__content">
              <Component {...props} />
            </div>
          </div>
          <div className="wrapper__page-bot">
            <Footer />
          </div>
        </div>
      )}
    />
  );
};

export default LayoutLogin;
