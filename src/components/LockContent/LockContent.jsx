import React, {Component} from 'react'
import Button from '../Button/Button'
import { lang } from '../../assets/js/lang';
import { NavLink } from 'react-router-dom';
import Icon from 'Icon'

import './lock-content.css';

export default class LockContent extends Component {
    render(){
        let {className: classMod='', text='', ...rest} = this.props;
        let buttonText = 'Войти';
        let toUrl = false;

        switch (this.props.userVerifiedType) {
          case 'test':
            buttonText = 'Пройти тест';
            toUrl = '/register/quiz';
            break;
          case 'email':
            buttonText = 'Перейти';
            toUrl = '/';
            break;
          default:
            buttonText = 'Войти';
            toUrl = '/';
        }

        return (
            <div className={`lock-content ${classMod}`} {...rest} >
                <div className="lock-content__icon-wrap">
                    <Icon icon="locked_fill" className="lock-content__icon"/>
                </div>
                <div className="lock-content__container">
                    <div className="lock-content__text" dangerouslySetInnerHTML={{ __html: text }}></div>
                    <div className="lock-content__buttons">
                        <Button to={toUrl} text={buttonText} className="lock-content_button"/>
                        <NavLink to="/register" className="lock-content__link">{lang('lock','register')}</NavLink>
                    </div>
                </div>
            </div>
        )
    }
}
