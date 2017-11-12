import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import * as C from '../../constants/app';
import { endingWords, getInitialsName } from '../../assets/js/helpers';

import './authors.css';

const Authors = (props) => {
  if (!props.items.length) return null;

  const title = endingWords(props.titleVariants, props.items.length);
  let itemModGrid = '';

  if (props.items.length === 2) {
    itemModGrid = 'authors__item_col-2';
  } else if (props.items.length > 2) {
    itemModGrid = 'authors__item_col-3';
  }

  return (
    <div className={`authors ${props.className ? props.className : ''}`}>
      { title && <h3 className="authors__title">{title}</h3> }
      <div className="authors__items">
        {
          props.items.filter(author => author.id).map((author, index) => {
            const authorInitials = getInitialsName(author.name);
            const avatar = author.avatar ? `${C.URL_API}${author.avatar}` : false;
            return (
              <div className={`authors__item ${itemModGrid}`} key={author.id || `author_${index}`}>
                {
                  props.isUserVerified
                    ? (<NavLink className="authors__item-row" to={`/profile/user/${author.id}`}>
                      <div className="authors__item-img-wrap" style={avatar ? { backgroundImage: `url(${avatar})`, backgroundColor: 'transparent' } : {}}>
                        {!author.avatar && authorInitials}
                      </div>
                      <div className="authors__item-name">{`${author.last_name} ${author.first_name}`}</div>
                    </NavLink>)
                    : (<span className="authors__item-row">
                      <div className="authors__item-img-wrap" style={avatar ? { backgroundImage: `url(${avatar})`, backgroundColor: 'transparent' } : {}}>
                        {!author.avatar && authorInitials}
                      </div>
                      <div className="authors__item-name">{`${author.last_name} ${author.first_name}`}</div>
                    </span>)
                }

                {author.academic_rank && <div className="authors__item-role">{author.academic_rank}</div>}
                {author.academic_degree && <div className="authors__item-role">{author.academic_degree}</div>}

              </div>
            );
          })
        }
      </div>

    </div>
  );
};

export default Authors;

Authors.propTypes = {
  className: PropTypes.string,
  titleVariants: PropTypes.arrayOf(PropTypes.string),
  items: PropTypes.arrayOf(PropTypes.shape({
    photo: PropTypes.oneOfType([PropTypes.object, PropTypes.element]),
    name: PropTypes.string,
    role: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  isUserVerified: PropTypes.bool,
};
Authors.defaultProps = {
  className: '',
  titleVariants: [],
  items: [],
  isUserVerified: false,
};
