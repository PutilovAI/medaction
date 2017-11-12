import React from 'react';
import PropTypes from 'prop-types';

import './icon.css';

const Icon = props => (
  <i
    className={`icon ${props.className} icon_${props.icon && props.icon}`}
    onClick={props.onClick}
    role="button"
    tabIndex="0"
    data-id={props.data}
  />);

Icon.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({}),
    PropTypes.bool,
  ])
};

Icon.PropTypes = {
  className: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  onClick: PropTypes.func,
};

Icon.defaultProps = {
  className: '',
  icon: false,
  onClick: () => {},
  data: false,
};

export default Icon;
