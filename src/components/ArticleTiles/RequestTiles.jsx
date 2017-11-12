import React from 'react';
import { NavLink } from 'react-router-dom';
import { autobind } from 'core-decorators';
import Articles from './ArticleTiles';

import './article-tiles.css';

export default class RequestTiles extends Articles {
  removeRequest = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (this.props.removeRequest) {
      this.props.removeRequest(e.target.getAttribute('data-id'));
    }
  }

  render() {
    return (
      <div className={`article-tiles ${this.props.className}`}>
        {
          this.props.items.map((item) => {
            const itemId = item.id;
            const itemHref = `/article/edit/${itemId}`;

            return (
              <div className="article-tiles__item_request-wrap" key={itemId}>
                <NavLink to={itemHref} className={'article-tiles__item article-tiles__item_request'} key={itemId}>
                  <div className="article-tiles__item_request-content">

                    <div className="article-tiles__item-meta">
                      {item.section && <div className="article-tiles__item-type">{item.section.display_value}</div>}
                    </div>

                    {item.title && <div className="article-tiles__item-title">{item.title}</div>}
                  </div>
                </NavLink>
                <div className="article-tiles__item_request-remove" onClick={this.removeRequest} data-id={itemId} role="button" tabIndex="0">Отменить заявку на публикацию</div>
              </div>
            );
          })
        }
      </div>
    );
  }
}
