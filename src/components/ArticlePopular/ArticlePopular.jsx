import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import './article-popular.css';

const ArticlePopular = props => (
  <div className={`article-popular ${props.className ? props.className : ''}`}>
    <div className="article-popular__items">
      {
        props.items.map((item) => {
          const itemHref = `/articles/${item.id}`;
          let thumb = false;
          if (item.thumbnail && item.thumbnail.url) {
            thumb = item.thumbnail.url;
          }

          return (
            <NavLink to={itemHref} className={'article-popular__item'} key={item.id}>
              {
                thumb
                  ? <div className="article-popular__item-img-wrap" style={{ backgroundImage: `url(${API_URL}${thumb})` }} />
                  : <div className="article-popular__item-img-wrap" />
              }
              <div className="article-popular__item-content">
                <div className="article-popular__item-meta">
                  {item.section && <div className="article-popular__item-type">{item.section.display_value}</div>}
                  {item.first_published_at && <div className="article-popular__item-date">{ moment(item.first_published_at).format('DD MMMM YYYY') }</div>}
                </div>

                {item.title && <div className="article-popular__item-title">{item.title}</div>}
                {item.teaser && <div className="article-popular__item-desc">{item.teaser}</div>}
              </div>


            </NavLink>
          );
        })
      }
    </div>

  </div>
);

export default ArticlePopular;

ArticlePopular.propTypes = {
  className: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({}),
  ),
};

ArticlePopular.defaultProps = {
  className: '',
  items: [],
};
