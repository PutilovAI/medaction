import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
// import { NavLink } from 'react-router-dom';
import { HashLink as NavLink } from 'react-router-hash-link';

import { URL_API } from '../../constants/app';
import { throttle, limitRow } from '../../assets/js/helpers';
import { lang } from '../../assets/js/lang';

import CommentsCount from '../Comments/CommentsCount';
import Icon from '../../components/Icon/Icon';
import './videoteka-tiles.css';

export class VideotekaTile extends Component {
  static propTypes = {
    thumbnail: PropTypes.oneOfType([
      PropTypes.shape({
        alt: PropTypes.string,
        height: PropTypes.number,
        url: PropTypes.string,
        width: PropTypes.number,
      }),
      PropTypes.string,
    ]),
    type: PropTypes.shape({
      key: PropTypes.string,
      display_value: PropTypes.string,
    }),
    starts_at: PropTypes.oneOfType([
      PropTypes.oneOf([null]),
      PropTypes.string,
    ]),
    title: PropTypes.string,
    speakers: PropTypes.arrayOf(PropTypes.object),
    id: PropTypes.number,
    page: PropTypes.string,
    removeFromFavAction: PropTypes.func,
  };

  static defaultProps = {
    thumbnail: {
      alt: '',
      height: 0,
      url: '',
      width: 0,
    },
    type: {
      key: 'l',
      display_value: 'Лекция',
    },
    starts_at: null,
    title: '',
    speakers: [],
    id: 0,
    page: '',
    removeFromFavAction: () => {},
  };

  componentDidMount() {
    const element = this.videoTitle;

    // Задержка, чтобы успели подгрузится стили с шрифты
    setTimeout(() => {
      limitRow({ element, rows: 2 });
    }, 100);

    window.addEventListener('resize', this.handleWindowResize);
  }

  getSpeakerName = (data) => {
    if (!data) {
      return '';
    }

    if (data.first_name || data.last_name) {
      return `${data.first_name && `${data.first_name} `}${data.last_name}`;
    }

    return '';
  }

  handleWindowResize = throttle(() => {
    limitRow({
      element: this.videoTitle,
      rows: 2,
      text: this.props.title,
    });
  }, 200);

  parseDate = (data, typeState) => {
    let metaSoon = '';
    let metaSoonTime = '';
    let metaSoonDate = '';

    const now = moment(new Date());
    const momentStart = moment(data);

    // Еще не началась
    if (moment().isSameOrBefore(momentStart)) {
      typeState = 'state-soon';
      metaSoon = momentStart.fromNow();
      metaSoonTime = momentStart.format('HH:mm');
      metaSoonDate = momentStart.format('DD MMMM');

      const dur = moment.duration(momentStart - now);
      const days = dur.days();
      const hours = dur.hours();
      const months = dur.months();

      const timeLImitRangeTomorrow = (24 - now.hours()) + 24;
      let hoursTomorrow = (days * 24) + hours;

      if (dur.minutes() > 0) {
        hoursTomorrow += 1;
      }

      if (months < 0 && hoursTomorrow < timeLImitRangeTomorrow && hoursTomorrow >= (24 - now.hours())) {
        metaSoon = 'завтра';
      } else if (months < 0 && days < 1 && (hours > 20 && hours < 23)) {
        metaSoon = `через ${hours + 1} часа`;
      }
    } else {
      metaSoonDate = momentStart.format('DD MMMM');
    }

    return {
      metaSoon,
      metaSoonTime,
      metaSoonDate,
      typeState,
    };
  }

  parseInfo = (momentData) => {
    // если это промо-страница, то тут вариант только с датой добавления видео
    if (momentData.typeState === 'state-soon') {
      return (<div className="videoteka-tile__meta">
        <div className="videoteka-tile__meta-item">
          <Icon className="videoteka-tile__meta-item-icon" icon="calendar" />
          <span className="videoteka-tile__meta-item-text">{momentData.metaSoonDate}</span>
        </div>
        <div className="videoteka-tile__meta-item">
          <Icon className="videoteka-tile__meta-item-icon" icon="clock" />
          <span className="videoteka-tile__meta-item-text">{momentData.metaSoonTime}</span>
        </div>
      </div>);
    }

    if (momentData.typeState !== 'state-soon') {
      return (<div className="videoteka-tile__meta">
        <div className="videoteka-tile__meta-item">
          <Icon className="videoteka-tile__meta-item-icon" icon="play" />
          {(momentData.typeState === 'state-finished') && (
            <span className="videoteka-tile__meta-item-text">{lang('video', 'watch_enable_on')}</span>
          )}
          {(momentData.typeState === 'state-begin') && (
            <span className="videoteka-tile__meta-item-text">{lang('video', 'watch_enable_online')}</span>
          )}
        </div>
      </div>);
    }

    return null;
  }

  handleRemoveFromFav = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const action = this.props.favorite ? { action: 'unset' } : { action: 'set' };
    this.props.removeFromFavAction(action, 'video', e.target.getAttribute('data-id'));
  }

  render() {
    const {
      type,
      starts_at,
      title,
      speakers,
      id,
    } = this.props;

    let { thumbnail } = this.props;

    let classMod = `videoteka-tile_${type.key}`;
    const previewBg = {};
    let typeState = 'state-finished';

    if (thumbnail && thumbnail !== null && thumbnail.url) {
      previewBg.backgroundImage = `url('${URL_API}${thumbnail.url}')`;
    } else {
      thumbnail = {};
      thumbnail.url = '';
    }

    // получаем информацию от moment про начало видео
    const momentData = this.parseDate(starts_at, typeState);

    classMod += ` ${momentData.typeState}`;

    if (type.key === 'l') {
      classMod += ' videoteka-tile_type_lecture';
    }

    const urlTo = `/videoteka/${this.props.id}`;
    const infoJSX = this.parseInfo(momentData);

    let favIcon = null;
    if (this.props.page && this.props.page === 'favorites') {
      favIcon = (
        <Icon className={`videoteka-tile__favorites ${this.props.favorite ? '' : 'videoteka-tile__favorites_false'}`} data={id} icon="star" onClick={this.handleRemoveFromFav} />
      );
    }

    return (
      <NavLink className={`videoteka-tile ${classMod}`} to={urlTo}>
        <div className="videoteka-tile__preview">
          { favIcon }
          <div className={`videoteka-tile__preview-container ${thumbnail.url ? '' : 'videoteka-tile__preview-container_noimg'}`} style={previewBg}>

            {(momentData.typeState !== 'state-soon') && (this.props.pageType !== 'promo') && (
              <div className="videoteka-tile__preview-content">
                <Icon className="videoteka-tile__preview-play" icon="video_button_big_color" />
              </div>
            )}

            {(momentData.typeState === 'state-soon') && (
              <div className="videoteka-tile__preview-content">
                <div className="videoteka-tile__preview-desc">{lang('video', 'watch_enable')}</div>
                <div className="videoteka-tile__preview-desc videoteka-tile__preview-desc_big">{momentData.metaSoon}</div>
              </div>
            )}

          </div>

          <div className={`videoteka-tile__preview-type videoteka-tile__preview-type_${type.key === 'l' ? 'lecture' : 'webinar'}`}>
            <Icon className="videoteka-tile__preview-type-icon" icon={`${type.key === 'l' ? 'lecture' : 'webinar'}`} />
          </div>
        </div>

        <div className="videoteka-tile__content">
          <div className="videoteka-tile__title" ref={(c) => { this.videoTitle = c; }}>{title}</div>
          <div className="videoteka-tile__authors">
            {speakers.map((author, ind, arr) => (
              <span className="videoteka-tile__author" key={ind}>{this.getSpeakerName(author)} {(ind !== (arr.length - 1) && ',')} </span>
            ))}
          </div>

        </div>

        {infoJSX}

      </NavLink>
    );
  }
}

export class VideotekaTilePromo extends VideotekaTile {
  render() {
    const {
      thumbnail,
      type,
      title,
      speakers,
      starts_at,
    } = this.props;

    let classMod = `videoteka-tile_${type.key}`;
    const previewBg = {};
    const typeState = 'state-finished';

    if (thumbnail.url) {
      previewBg.backgroundImage = `url('${URL_API}${thumbnail.url}')`;
    }

    classMod = ` ${typeState}`;
    if (type.key === 'l') {
      classMod = ' videoteka-tile_type_lecture';
    }

    const urlTo = `/videoteka/${this.props.id}`;

    let momentStart = moment(starts_at);
    momentStart = momentStart.format('DD MMMM');

    return (
      <NavLink className={`videoteka-tile_promo ${classMod}`} to={urlTo}>
        <div className="videoteka-tile__preview-promo">
          <div className={`videoteka-tile__preview-container ${thumbnail.url ? '' : 'videoteka-tile__preview-container_noimg'}`} style={previewBg}>
            <div className="videoteka-tile__preview-content">
              <div className="videoteka-tile__preview-desc videoteka-tile__preview-desc_big" />
            </div>
          </div>
        </div>

        <div className="videoteka-tile__content-promo">
          <div className="videoteka-tile__meta-item">
            <span className="videoteka-tile__meta-type">
              {`${lang('video', type.key === 'l' ? 'lecture' : 'webinar')}  `}
            </span>
            <span className="videoteka-tile__meta-item-text">{momentStart}</span>
          </div>
          <div className="videoteka-tile__content">
            <div className="videoteka-tile__title" ref={(c) => { this.videoTitle = c; }}>{title}</div>
          </div>
          <div className={`videoteka-tile__preview-type videoteka-tile__preview-type_${type.key === 'l' ? 'lecture' : 'webinar'}`}>
            <Icon className="videoteka-tile__preview-type-icon" icon={`${type.key === 'l' ? 'lecture' : 'webinar'}`} />
          </div>
          <div className="videoteka-tile__authors">
            {speakers.map((author, ind, arr) => (
              <span className="videoteka-tile__author" key={ind}>{this.getSpeakerName(author)} {(ind !== (arr.length - 1) && ',')} </span>
            ))}
            <CommentsCount comments={this.props.comments_count} />
          </div>
        </div>
      </NavLink>
    );
  }
}

export class VideotekaTilePromoItem extends VideotekaTile {
  render() {
    const {
      thumbnail,
      type,
      starts_at,
      title,
      speakers,
    } = this.props;

    let classMod = `videoteka-tile_${type.key}`;
    const previewBg = {};
    const typeState = 'state-finished';

    if (thumbnail && thumbnail.url) {
      previewBg.backgroundImage = `url('${URL_API}${thumbnail.url}')`;
    }

    // получаем информацию от moment про начало видео
    const momentData = this.parseDate(starts_at, typeState);

    classMod += ` ${momentData.typeState}`;
    if (type.key === 'l') {
      classMod += ' videoteka-tile-promo_type_lecture';
    }

    const urlTo = `/videoteka/${this.props.id}`;

    let momentStart = moment(starts_at);
    momentStart = momentStart.format('DD MMMM');

    return (
      <div className={`videoteka-tile-promo ${classMod}`}>
        <div className="videoteka-tile__preview">
          <NavLink to={urlTo} className={`videoteka-tile__preview-container ${(thumbnail && thumbnail.url) ? '' : 'videoteka-tile__preview-container_noimg'} ${momentData.typeState === 'state-soon' ? 'videoteka-tile__preview-soon' : ''}`} style={previewBg}>

            {(momentData.typeState === 'state-soon') && (
              <div className="videoteka-tile__preview-content">
                <div className="videoteka-tile__preview-desc">{lang('video', 'watch_enable')}</div>
                <div className="videoteka-tile__preview-desc videoteka-tile__preview-desc_big">{momentData.metaSoon}</div>
              </div>
            )}

          </NavLink>

          <div className={`videoteka-tile__preview-type videoteka-tile__preview-type_${type.key === 'l' ? 'lecture' : 'webinar'}`}>
            <Icon className="videoteka-tile__preview-type-icon" icon={`${type.key === 'l' ? 'lecture' : 'webinar'}`} />
          </div>
        </div>

        <div className="videoteka-tile__content">
          <NavLink to={urlTo}>
            <div className="videoteka-tile__title" ref={(c) => { this.videoTitle = c; }}>{title}</div>
          </NavLink>
          <div className="videoteka-tile__authors">
            {
              speakers.length ?
                <span className="videoteka-tile__author">{this.getSpeakerName(speakers[0])}</span>
                : null
            }
          </div>

          <div className="videoteka-tile__meta-item">
            <Icon className="videoteka-tile__meta-item-icon" icon="calendar" />
            <span className="videoteka-tile__meta-item-text">{momentStart}</span>
          </div>
        </div>

      </div>
    );
  }
}

const VideotekaTiles = (props) => {
  if (!props.items) {
    return null;
  }
  return (<div className="videoteka-tiles">
    <div className="videoteka-tiles__items">
      {
        props.items.results.map((item, ind) => (
          <VideotekaTile
            {...item}
            key={ind}
            page={props.page}
            removeFromFavAction={props.removeFromFavAction}
          />
        ))
      }
    </div>
  </div>);
};

export const VideotekaTilesPromo = (props) => {
  if (!props.items) {
    return null;
  }

  return (<div className="videoteka-tiles">
    <div className="videoteka-tiles__items">
      {
        props.items.map((item, ind) => (
          <VideotekaTilePromoItem {...item} key={ind} />
        ))
      }
    </div>
  </div>);
};

VideotekaTiles.propTypes = {
  items: PropTypes.oneOfType([
    PropTypes.shape({
      results: PropTypes.array,
    }),
    PropTypes.bool,
  ]),
  page: PropTypes.string,
  removeFromFavAction: PropTypes.func,
};

VideotekaTiles.defaultProps = {
  items: {
    results: [],
  },
  page: '',
  removeFromFavAction: () => {},
};

VideotekaTilesPromo.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.object,
  ),
};

VideotekaTilesPromo.defaultProps = {
  items: [],
};

export default VideotekaTiles;
