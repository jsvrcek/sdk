/*
 * Copyright 2015-present Boundless Spatial Inc., http://boundlessgeo.com
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React from 'react';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import LoginModal from './LoginModal.jsx';
import AppDispatcher from '../dispatchers/AppDispatcher.js';
import LoginConstants from '../constants/LoginConstants.js';
import AuthService from '../services/AuthService.js';
import pureRender from 'pure-render-decorator';

const messages = defineMessages({
  buttontext: {
    id: 'login.buttontext',
    description: 'Button text for login',
    defaultMessage: 'Login'
  },
  logouttext: {
    id: 'login.logouttext',
    description: 'Button text for log out',
    defaultMessage: 'Logout'
  }
});

/**
 * Button that shows a login dialog for integration with GeoServer security.
 *
 * ```xml
 * <Login />
 * ```
 */
@pureRender
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      value: null
    };
    var me = this;
    AppDispatcher.register((payload) => {
      let action = payload.action;
      switch (action.type) {
        case LoginConstants.LOGIN:
          me._doLogin(action.user, action.pwd, action.failure, action.scope);
          break;
        default:
          break;
      }
    });
  }
  componentDidMount() {
    var me = this;
    this._request = AuthService.getStatus(this.props.url, function(user) {
      delete me._request;
      me.setState({user: user});
    }, function() {
      delete me._request;
      me.setState({user: null});
    });
  }
  componentWillUnmount() {
    if (this._request) {
      this._request.abort();
    }
  }
  _doLogin(user, pwd, failureCb, scope) {
    var me = this;
    AuthService.login(this.props.url, user, pwd, function() {
      me.setState({user: user});
    }, function(xmlhttp) {
      me.setState({user: null});
      failureCb.call(scope, xmlhttp);
    });
  }
  _showLoginDialog() {
    this.refs.loginmodal.getWrappedInstance().open();
  }
  _doLogout() {
    AuthService.logoff();
    this.setState({user: null});
  }
  _handleChange(event, value) {
    if (value === 1) {
      this._doLogout();
    }
    this.setState({value: value});
  }
  render() {
    const {formatMessage} = this.props.intl;
    if (this.state.user !== null) {
      return (
        <IconMenu {...this.props} iconButtonElement={<RaisedButton label={this.state.user} />} value={this.state.value} onChange={this._handleChange.bind(this)}>
          <MenuItem value={1} primaryText={formatMessage(messages.logouttext)}/>
        </IconMenu>
      );
    } else {
      return (
        <RaisedButton {...this.props} label={formatMessage(messages.buttontext)} onTouchTap={this._showLoginDialog.bind(this)}>
          <LoginModal ref='loginmodal' {...this.props} />
        </RaisedButton>
      );
    }
  }
}

Login.propTypes = {
  /**
   * Url to geoserver login endpoint.
   */
  url: React.PropTypes.string,
  /**
   * i18n message strings. Provided through the application through context.
   */
  intl: intlShape.isRequired
};

Login.defaultProps = {
  style: {
    margin: '10px 12px'
  },
  url: '/geoserver/app/api/login'
};

export default injectIntl(Login);
