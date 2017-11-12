import React from 'react';
import { Route } from 'react-router';

import Footer from '../components/Footer/Footer';
import Menu from '../components/Menu/Menu';

const LayoutMain = ( { component: Component, ...rest } ) => {
  return (
    <Route
      onUpdate={window.scrollTo(0, 0)}
      {...rest}
      render={(props) => {
        return (<div className={`wrapper__page ${rest.className || ''}`}>

          <div className="wrapper__page-top">
            <Menu />

            <div className="wrapper__content">
              <Component {...props} />
            </div>

          </div>

          <div className="wrapper__page-bot">
            <Footer />
          </div>

        </div>
        );
      }
      }
    />
  );
};

export default LayoutMain;
