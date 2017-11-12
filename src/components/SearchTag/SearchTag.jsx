import React, {Component} from 'react'
import {NavLink} from 'react-router-dom';

import './search-tag.css';

export default class SearchTag extends Component{
    render(){
        return(
            <NavLink to={this.props.to ? this.props.to : '/'} className={`search-tag ${this.props.mod ? this.props.mod : ''}`}>
                {this.props.text}
            </NavLink>
        )
    }
}