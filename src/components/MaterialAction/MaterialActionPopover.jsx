import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { autobind } from 'core-decorators';

import './material-action.css';

export default class MaterialActionPopover extends Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  componentDidMount() {
    // тут чет не работает, поэтому я закомментил до лучших времен
    // this.setPosition();
    // window.addEventListener('resize', this.setPosition);
  }

  componentWillReceiveProps(nextProps) {
    // тут чет не работает, поэтому я закомментил до лучших времен
    // this.setPosition(nextProps);
  }

  componentWillUnmount() {
    // тут чет не работает, поэтому я закомментил до лучших времен
    // window.removeEventListener('resize', this.setPosition);
  }

  setPosition(nextProps) {
    let props = this.props;

    if (!(nextProps instanceof Event) && typeof (nextProps) !== 'undefined') {
      props = nextProps;
    }

    let { target } = props;
    const { isOpen } = props;
    if (!target) return;

    target = findDOMNode(target);

    let { popover, arrow } = this.refs;
    const bodyWidth = document.body.offsetWidth;

    if (bodyWidth > 768) {
      popover.style = null;
      arrow.style = null;
    } else if (isOpen) {
      const shift = 10;
      const oldStyleLeft = popover.style.left ? parseFloat(popover.style.left) : 0;
      let newLeft = oldStyleLeft;
      let newBottom = 0;
      let newLeftArrow = 0;

      popover.style.display = 'block';

      const coordsPopover = popover.getBoundingClientRect();
      const coordsTarget = target.getBoundingClientRect();
      const coordsArrow = arrow.getBoundingClientRect();

      const centerPopover = coordsPopover.left + (coordsPopover.width / 2);
      const centerTarget = coordsTarget.left + (coordsTarget.width / 2);

      newLeft = centerTarget - (coordsPopover.width / 2);

      if (centerTarget === centerPopover) {
        newLeft = oldStyleLeft;
      } else if (newLeft <= shift) {
        newLeft = shift;
      } else if ((newLeft + coordsPopover.width) >= (bodyWidth - shift)) {
        newLeft = coordsPopover.left +
          (bodyWidth - (coordsPopover.left + coordsPopover.width) - shift);
      }

      newBottom = coordsTarget.height + 20;
      newLeftArrow = centerTarget - newLeft - (coordsArrow.width / 2);

      popover.style.left = `${newLeft}px`;
      popover.style.bottom = `${newBottom}px`;
      arrow.style.left = `${newLeftArrow}px`;
    } else {
      popover.style.display = 'none';
    }
  }

  render() {
    let {className: classMod='', isOpen, children, target} = this.props;

    return (
      <div className={`material-action__popover ${classMod} ${isOpen ? 'state-open' : ''}`} ref="popover" >
        <div className="material-action__popover-content">
          {children}
        </div>

        <div className="material-action__popover-arrow" ref="arrow" />
      </div>
    );
  }
}
