import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import CommentsCount from '../Comments/CommentsCount';
import * as C from '../../constants/app';
import Icon from '../../components/Icon/Icon';

import './article-tiles.css';

export class ArticleTiles extends Component {
  handleRemoveFromFav = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.removeFromFavAction('article', e.target.getAttribute('data-id'));
  }

  render() {
    return (
      <div className={`article-tiles ${this.props.className}`}>
        {
          this.props.items.map((item) => {
            const itemId = item.id;
            const itemHref = `/articles/${itemId}`;
            const itemDate = item.first_published_at ? moment(item.first_published_at).format('DD MMMM YYYY') : null;

            let favIcon = null;
            if (this.props.page && this.props.page === 'favorites') {
              favIcon = (
                <Icon className="article-tiles__favorites" data={itemId} icon="star" onClick={this.handleRemoveFromFav} />
              );
            }

            return (
              <NavLink to={itemHref} className={'article-tiles__item'} key={itemId}>
                {favIcon}
                <div className={`article-tiles__item-img-wrap ${item.thumbnail ? '' : 'article-tiles__item-img-wrap_no-image'}`} style={item.thumbnail ? ({ backgroundImage: `url(${C.URL_API}${item.thumbnail.url})` }) : ({})}>
                  <div className="article-tiles__item-img-overlay">
                    {item.teaser && <div className="article-tiles__item-img-overlay-desc">{item.teaser}</div>}
                  </div>
                </div>

                <div className="article-tiles__item-content">

                  <div className="article-tiles__item-meta">
                    {item.section && <div className="article-tiles__item-type">{item.section.display_value}</div>}
                    {itemDate && <div className="article-tiles__item-date">{itemDate}</div>}
                  </div>

                  {item.title && <div className="article-tiles__item-title">{item.title}</div>}

                  <CommentsCount comments={item.comments_count} />
                </div>
              </NavLink>
            );
          })
        }
      </div>
    );
  }
}

export default ArticleTiles;

ArticleTiles.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape(
    {
      img: PropTypes.string,
      type: PropTypes.oneOfType([
        PropTypes.shape({}),
        PropTypes.string,
      ]),
      date: PropTypes.string,
      title: PropTypes.string,
      desc: PropTypes.string,
    },
  )),
  page: PropTypes.string,
  removeFromFavAction: PropTypes.func,
};
ArticleTiles.defaultProps = {
  className: '',
  items: [],
  page: '',
  removeFromFavAction: () => {},
};
