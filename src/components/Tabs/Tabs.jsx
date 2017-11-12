import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './tabs.css';
import TabItem from './TabItem';


export default class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: this.props.activeTab,
    };

    this.handleUpdateActive = this.updateActive.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeTab !== this.props.activeTab) {
      this.setState({
        tabActive: nextProps.activeTab,
      });
    }
  }

  updateActive(name) {
    this.setState({
      tabActive: name,
    });

    const updateData = {};
    updateData[this.props.name] = name;
    this.props.onUpdate(updateData);
  }

  render() {
    const {
      className: classMod = '',
      items,
      itemClassName,
    } = this.props;

    return (
      <div className={`tabs ${classMod}`}>
        <div className="tabs__items">
          {items.map((item, ind) => (
            <TabItem
              {...item}
              className={itemClassName}
              updateActive={this.handleUpdateActive}
              key={ind}
              active={((this.state.tabActive === item.id) || (ind === 0 && this.state.tabActive === 'default'))}
            />
          ))}
        </div>
      </div>
    );
  }
}

Tabs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  itemClassName: PropTypes.string,
  className: PropTypes.string,
  onUpdate: PropTypes.func,
  name: PropTypes.string,
  activeTab: PropTypes.string,
};

Tabs.defaultProps = {
  items: [],
  itemClassName: '',
  className: '',
  onUpdate: () => {},
  name: '',
  activeTab: 'default',
};
