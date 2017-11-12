import React, { Component } from 'react';
import dcopy from 'deep-copy';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import { endingWords } from '../../assets/js/helpers';
import { lang } from '../../assets/js/lang';
import Icon from '../Icon/Icon';
import './filtering.css';
import Button from '../Button/Button';

export default class Filtering extends Component {
  static propTypes = {
    updateFilter: PropTypes.func,
    className: PropTypes.string,
    onClear: PropTypes.func,
    applyFilter: PropTypes.func,
    filter: PropTypes.shape({
      fields: PropTypes.shape({
        search_query: PropTypes.string,
      }),
    }),
  };

  static defaultProps = {
    updateFilter: () => {},
    className: '',
    onClear: () => {},
    applyFilter: () => {},
    filter: {
      fields: {
        search_query: '',
      },
    },
  };

  state = {
    filter: {},
    tempFilter: {},
    countSelectedFilters: null,
    countSelectedTempFilters: null,
    isOpen: false,
  };

  componentDidMount() {
    this.onRecieveData(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.onRecieveData(nextProps);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handlerBodyClick);
  }

  onRecieveData(props) {
    const {
      renderFields,
      filter: {
        fields = {},
      },
    } = props;

    if (renderFields) {
      this.renderFields = renderFields;
    }
    this.onUpdateFields(fields);
  }

  onUpdateFields(fields) {
    let filtersCount = 0;

    Object.keys(fields).forEach(() => {
      filtersCount += 1;
    });

    this.setState({
      tempFilter: fields,
      countSelectedTempFilters: filtersCount,
    }, () => {
      this.applyFilter();
    });
  }

  @autobind
  handleOnSearch(event) {
    this.props.updateFilter({
      fields: Object.assign({}, this.state.tempFilter, { search_query: event.target.value }),
    });
  }

  @autobind
  handleOnClickFilterControl() {
    this.setState({
      isOpen: !this.state.isOpen,
    }, () => {
      if (this.state.isOpen) {
        document.body.addEventListener('click', this.handlerBodyClick);
      }
    });
  }

  @autobind
  handleOnClickButtonApply(event) {
    event.preventDefault();
    this.applyFilter();
    this.filterClose();
    this.props.applyFilter();
  }

  @autobind
  handleOnClickButtonCancel() {
    this.handleClearFilter();
    setTimeout(() => {
      this.filterClose();
      this.props.applyFilter();
    }, 100);
  }

  applyFilter() {
    this.setState({
      filter: dcopy(this.state.tempFilter),
      countSelectedFilters: this.state.countSelectedTempFilters,
    });
  }

  @autobind
  handleClearFilter() {
    this.setState({
      tempFilter: {},
      countSelectedTempFilters: null,
      countSelectedFilters: null,
    }, () => {
      this.props.updateFilter({});
      if (document.body.offsetWidth >= 768) {
        this.applyFilter();
      }
      this.props.onClear();
    });
  }

  filterClose() {
    this.setState({
      isOpen: false,
    }, () => {
      document.body.removeEventListener('click', this.handlerBodyClick);
    });
  }

  handleOnClickButtonCancel() {

  }

  // Чтобы можно было удалить событие
  handlerBodyClick = (e) => {
    const target = e.target;
    if (!target.closest('.filtering')) {
      this.filterClose();
    }
  }

  renderFields = () => {};

  render() {
    const {
      className: classMod,
    } = this.props;

    const {
      countSelectedFilters: count,
      countSelectedTempFilters: countTemp,
    } = this.state;

    let elFilterClearWrap = null;
    let elFilterClearWrapMobile = null;
    let elFilterControl = null;

    if (countTemp > 0) {
      const strMachSelected = `${endingWords(lang('filters', 'select'), countTemp)} ${countTemp} ${endingWords(lang('filters', 'filter'), countTemp)}`;

      elFilterClearWrapMobile = (
        <div className={'filter__clear-wrap'}>
          <span className="filter__mach-selected">{strMachSelected}</span>
          <span className="filter__link-clear" onClick={this.handleClearFilter} role="button" tabIndex="0">{lang('filters', 'reset')}</span>
        </div>
      );
    }

    if (count > 0) {
      const strMachSelected = `${endingWords(['Выбран', 'Выбраны', 'Выбраны'], count)} ${count} ${endingWords(['фильтр', 'фильтра', 'фильтров'], count)}`;

      elFilterClearWrap = (
        <div className={'filter__clear-wrap'}>
          <span className="filter__mach-selected">{strMachSelected}</span>
          <span className="filter__link-clear" onClick={this.handleClearFilter} role="button" tabIndex="0">{lang('filters', 'reset')}</span>
        </div>
      );
    }

    elFilterControl = (() => {
      const classMod2 = `filtering__filter-control ${count ? 'state-noempty' : ''} ${this.state.isOpen ? 'state-open' : ''}`;

      return (
        <div className={classMod2} onClick={this.handleOnClickFilterControl} role="button" tabIndex="0">
          { count > 0 && !this.state.isOpen && <div className="filtering__filter-control-count">{count}</div> }
        </div>
      );
    })();

    let searchVal = '';

    if (this.props.filter.fields && this.props.filter.fields.search_query !== '') {
      searchVal = this.props.filter.fields.search_query;
    }

    const inputComp = (<input
      type="text"
      className="filtering__search-input"
      onChange={this.handleOnSearch}
      value={searchVal}
    />);

    return (
      <div className={`filtering ${classMod} ${this.state.isOpen ? 'state-show' : ''}`}>
        <div className={`filtering__shadow ${this.state.isOpen ? 'state-show' : ''}`} />

        <div className="filtering__container">
          <div className="filtering__search-wrap">
            <form className="filtering__search" onSubmit={this.handleOnClickButtonApply}>
              {inputComp}
              <div className="filtering__search-button">
                <Icon icon="search" onClick={this.handleOnClickButtonApply} />
              </div>
              <div className="filtering__search-cancel">
                <Icon icon="cancel" onclick={this.handleOnClickButtonCancel} />
              </div>
            </form>

            {elFilterControl}

          </div>

          <div className={`filter ${this.state.isOpen ? 'state-open' : ''}`}>
            <div className="filter__container">
              <div className="filter__title filter-show-mobile">{lang('filters', 'select_head')}</div>

              <div className="filter-show-mobile">
                {elFilterClearWrapMobile}
              </div>

              {this.renderFields()}

              <div className="filter-show-desktop">
                { elFilterClearWrap }
              </div>
              <div className="filter__buttons-desktop">
                <Button text="Применить" onClick={this.handleOnClickButtonApply} />
              </div>
            </div>
            <div className="filter__buttons-mobile">
              <div className="filter__button-control filter__button-control_cancel" onClick={this.handleOnClickButtonCancel} role="button" tabIndex="0">
                <span className="filter__button-control-text">{lang('filters', 'cancel')}</span>
              </div>
              <div className="filter__button-control filter__button-control_apply" onClick={this.handleOnClickButtonApply} role="button" tabIndex="0">
                <span className="filter__button-control-text">{lang('filters', 'apply')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
