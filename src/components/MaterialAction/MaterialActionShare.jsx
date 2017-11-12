import React, { Component } from 'react';
import * as dcopy from 'deep-copy';
import { ShareButtons } from 'react-share';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Icon from '../../components/Icon/Icon';
import MaterialActionSocial from './MaterialActionSocial';
import MaterialActionPopover from './MaterialActionPopover';
import { lang } from '../../assets/js/lang';

import './material-action.css';

export default class MaterialActionShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
    };
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.handlerBodyClick);
  }

  @autobind
  onClickIconHandler() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    }, () => {
      if (this.state.popoverOpen) {
        document.body.addEventListener('click', this.handlerBodyClick);
      }
      if (this.props.onPopoverUpdate) {
        this.props.onPopoverUpdate(this.state.popoverOpen);
      }
    });
  }
  // Чтобы можно было удалить событие
  handlerBodyClick = (e) => {
    const target = e.target;
    if (!target.closest('.material-action__item_share')) {
      this.popoverClose();
    }
  }
  popoverClose() {
    this.setState({
      popoverOpen: false,
      tempAlarmTime: dcopy(this.state.alarmTime),
    }, () => {
      document.body.removeEventListener('click', this.handlerBodyClick)
      if (this.props.onPopoverUpdate) {
        this.props.onPopoverUpdate(false);
      }
    });
  }
  render() {
    const { className: classMod='', onPopoverUpdate } = this.props;
    const { popoverOpen } = this.state;
    const shareUrl = window.location.href;

    // https://github.com/nygardk/react-share плагин для шар
    const {
      FacebookShareButton,
      TwitterShareButton,
      VKShareButton,
      OKShareButton,
    } = ShareButtons;

    return (
      <div className="material-action__panel material-action__panel_share" >
        <div className={`material-action__item material-action__item_head material-action__item_share ${classMod}`} ref="share">

          <div className="material-action__item-link" role="button" tabIndex={-1} onClick={this.onClickIconHandler}>
            <div className="material-action__item-icon-wrap">
              <Icon icon="share" />
            </div>
            <div className="material-action__item-title">
              {lang('material', 'share')}
            </div>
          </div>

          <MaterialActionPopover isOpen={popoverOpen} target={this}>
            <div>
              <div className="material-action__popover-title">{lang('material', 'share')}</div>
              <div className="material-action__popover-controls">
                <div className="material-action__social-items">
                  <MaterialActionSocial name="fb" icon="soc_fb_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="vk" icon="soc_vk_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="tw" icon="soc_tw_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="ok" icon="soc_ok_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="fb_messenger" icon="soc_fb_messenger_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="gmail" icon="soc_gmail_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="google" icon="soc_google_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="hangouts" icon="soc_hangouts_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="skype" icon="soc_skype_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="telegram" icon="soc_telegram_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="viber" icon="soc_viber_color" className="material-action-social_mobile" />
                  <MaterialActionSocial name="whatsapp" icon="soc_whatsapp_color" className="material-action-social_mobile" />
                </div>
              </div>
            </div>

          </MaterialActionPopover>
        </div>
        {/*
        <div className="material-action__panel-items">
          <div className="material-action__item">
            <FacebookShareButton url={shareUrl} title={'Медэкшн'}>
              <MaterialActionSocial name="fb" />
            </FacebookShareButton>
          </div>
          <div className="material-action__item">
            <VKShareButton url={shareUrl} title={'Медэкшн'}>
              <MaterialActionSocial name="vk" />
            </VKShareButton>
          </div>
          <div className="material-action__item">
            <TwitterShareButton url={shareUrl} title={'Медэкшн'}>
              <MaterialActionSocial name="tw" />
            </TwitterShareButton>
          </div>
          <div className="material-action__item">
            <OKShareButton url={shareUrl}>
              <MaterialActionSocial name="ok" />
            </OKShareButton>
          </div>
        </div> */}
      </div>
    );
  }
}
