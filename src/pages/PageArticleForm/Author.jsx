import React, { Component } from 'react';
import dcopy from 'deep-copy';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import * as C from '../../constants/app';
import SelectAutocompleteAsync from '../../components/Select/SelectAutocompleteAsync';
import { Textarea, Input } from '../../components/Input/InputComponents';
import Icon from '../../components/Icon/Icon';
import AuthorSelectOption from './AuthorSelectOption';

import './article-form.css';

export default class Author extends Component {
  static propTypes = {
    id: PropTypes.number,
    author: PropTypes.shape({
      autocompleteMode: PropTypes.bool,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      academic_degree: PropTypes.string,
      academic_rank: PropTypes.string,
      email: PropTypes.string,
      avatar: PropTypes.string,
    }),
    errors: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.oneOf([null]),
      PropTypes.bool,
      PropTypes.shape({}),
    ]),
    updateAuthors: PropTypes.func,
    removeAuthor: PropTypes.func,
  };

  static defaultProps = {
    id: 0,
    author: {
      autocompleteMode: false,
      first_name: '',
      last_name: '',
      academic_degree: '',
      academic_rank: '',
      email: '',
      avatar: '',
    },
    errors: {},
    updateAuthors: () => {},
    removeAuthor: () => {},
  };

  state = {
    dropzone: '',
  }

  @autobind
  handleOnChangeSelectName(newValue) {
    this.props.updateAuthors(
      this.props.id,
      {
        ...newValue,
      },
    );
  }

  @autobind
  handleOnChangeInputSpecialization(e) {
    const { id: curId, author, updateAuthors } = this.props;
    const newAuthors = dcopy(authors);
    const value = e.target.value;

    if (value !== newAuthors[curId].specialization) {
      newAuthors[curId].specialization = value;
      updateAuthors(newAuthors);
    }
  }

  @autobind
  dropzoneUpdatePhoto(avatar) {
    this.setState({
      avatar,
    }, () => {
      this.props.updateAuthors(
        this.props.id,
        {
          ...this.props.author,
          avatar,
        },
      );
    });
  }

  @autobind
  dropzoneHandleFiles(files) {
    Array.from(files).forEach((item) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const photo = e.target.result;
        this.dropzoneUpdatePhoto(photo);
      };

      reader.readAsDataURL(item);
    });
  }

  @autobind
  handleDropzoneOnChange(e) {
    const files = e.target.files;

    if (!files.length) return;
    this.dropzoneHandleFiles(files);
  }

  @autobind
  handleDropzoneOnDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    const files = e.dataTransfer.files;

    if (!files.length) return;

    this.dropzoneHandleFiles.call(this, files);

    this.setState({
      dropzone: '',
    });
  }

  @autobind
  handleDropzoneOnDragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
    const cont = this.dropzoneContainer;
    cont.style.pointerEvents = 'none';

    this.setState({
      dropzone: 'dragenter',
    });
  }

  handleDropzoneOnDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  @autobind
  handleDropzoneOnDragLeave(e) {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      dropzone: '',
    });
  }

  @autobind
  handleRemoveItem() {
    this.props.removeAuthor(this.props.id);
  }

  @autobind
  handleAutocompleteFalse() {
    this.props.updateAuthors(
      this.props.id,
      {
        first_name: '',
        last_name: '',
        academic_degree: '',
        academic_rank: '',
        email: '',
        autocompleteMode: false,
      },
    );
  }

  @autobind
  handleOnChangeUserInfo(e) {
    const data = { ...this.props.author, [e.target.id]: e.target.value };

    this.props.updateAuthors(
      this.props.id,
      data,
    );
  }

  // формируем JSX, когда форма в состоянии автокомплита
  getAutocompleteJSX = () => (
    <div className="article-form-author">
      <div className="article-form-author__container">
        <div className="article-form-author__col_autocomplete">
          <SelectAutocompleteAsync
            onChange={this.handleOnChangeSelectName}
            value={null}
            onBlurResetsInput={false}
            valueKey="id"
            labelKey="last_name"
            getParam="last_name"
            url="/users/"
            optionComponent={AuthorSelectOption}
            placeholder="Начните набирать фамилию пользователя и выберете из списка"
          />
          <div className="article-form-author__autocomlete-false">
            или добавьте
            <span
              className="article-form-author__autocomlete-false-link"
              onClick={this.handleAutocompleteFalse}
              role="button"
              tabIndex="0"
            >
              нового пользователя
            </span>
          </div>
        </div>
      </div>
      <div className="article-form-author__remove" onClick={this.handleRemoveItem} role="button" tabIndex="0" />
    </div>
  )

  getAuthorJSX = autocomplete => (
    <div className="article-form-author">
      <div className="article-form-author__container">
        <div className="article-form-author__col-photo">
          <div className="article-form-author__photo-wrap">
            <label
              className={`article-form-author__dropzone ${this.state.dropzone}`}
              onDragEnter={this.handleDropzoneOnDragEnter}
              onDragOver={this.handleDropzoneOnDragOver}
              onDrop={this.handleDropzoneOnDrop}
              onDragLeave={this.handleDropzoneOnDragLeave}
              htmlFor={`article-form-author__dropzone-field_${this.props.id}`}
            >
              {
                !autocomplete &&
                <input
                  id={`article-form-author__dropzone-field_${this.props.id}`}
                  key={`article-form-author__dropzone-field_${this.props.id}`}
                  type="file"
                  accept="image/*"
                  className="article-form-author__dropzone-field"
                  onChange={this.handleDropzoneOnChange}
                />
              }
              <div className="article-form-author__dropzone-container" ref={(c) => { this.dropzoneContainer = c; }}>
                {(!this.props.author.avatar && !autocomplete) &&
                  <div>
                    <Icon className="article-form-author__dropzone-icon" icon="user_fill" />
                    <div className="article-form-author__dropzone-link">
                      <span className="article-form-author__dropzone-link-text">
                        Добавьте фото
                      </span>
                    </div>
                  </div>
                }
                {this.props.author.avatar && this.props.author.avatar.indexOf('base64') < 0 &&
                  <img alt="" src={`${C.URL_API}${this.props.author.avatar}`} className="article-form-author__photo" />}
                {this.props.author.avatar && this.props.author.avatar.indexOf('base64') > -1 &&
                  <div style={{ backgroundImage: `url(${this.props.author.avatar})` }} className="article-form-author__photo_base64" />}
              </div>
            </label>

          </div>
        </div>
        <div className="article-form-author__col-fields">
          <Input
            className="article-form-author__role-input_half"
            placeholder="Фамилия"
            id="last_name"
            value={this.props.author.last_name || ''}
            onChange={this.handleOnChangeUserInfo}
            disabled={autocomplete}
            error={this.props.errors && this.props.errors.last_name}
          />
          <Input
            className="article-form-author__role-input_half"
            placeholder="Имя"
            id="first_name"
            value={this.props.author.first_name || ''}
            onChange={this.handleOnChangeUserInfo}
            disabled={autocomplete}
            error={this.props.errors && this.props.errors.first_name}
          />
          <Input
            className="article-form-author__role-input"
            id="academic_degree"
            value={this.props.author.academic_degree}
            placeholder="Научная степень"
            onChange={this.handleOnChangeUserInfo}
            disabled={autocomplete}
            error={this.props.errors && this.props.errors.academic_degree}
          />
          <Input
            className="article-form-author__role-input"
            id="academic_rank"
            value={this.props.author.academic_rank}
            placeholder="Научное звание"
            onChange={this.handleOnChangeUserInfo}
            disabled={autocomplete}
            error={this.props.errors && this.props.errors.academic_rank}
          />
          {
            !autocomplete &&
            <Input
              className="article-form-author__role-input"
              id="email"
              value={this.props.author.email}
              placeholder="E-mail"
              onChange={this.handleOnChangeUserInfo}
              error={this.props.errors && this.props.errors.email}
            />
          }
        </div>
      </div>

      <div className="article-form-author__remove" onClick={this.handleRemoveItem} role="button" tabIndex="0" />
    </div>
  )

  render() {
    let element = null;

    if (this.props.author.autocompleteMode) {
      element = this.getAutocompleteJSX();
    } else {
      element = this.getAuthorJSX(this.props.author.id ? true : false);
    }

    return element;
  }
}
