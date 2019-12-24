import React, { Component, Fragment } from "react";
import Proptypes from "prop-types";

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiBadge
} from "@elastic/eui";

import WzConfigurationPath from '../util-components/configuration-path';
import WzConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import WzConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import withWzConfig from '../util-hocs/wz-config';

const helpLinks = [
  { text: 'How to use the registration service', href: 'https://documentation.wazuh.com/current/user-manual/registering/simple-registration-method.html' },
  { text: 'Registration service reference', href: 'https://documentation.wazuh.com/current/user-manual/reference/ossec-conf/auth.html' }
];

const mainSettings = [
  { key: 'disabled', text: 'Service status'},
  { key: 'port', text: 'Listen to connections at port'},
  { key: 'use_source_ip', text: 'Use client\'s source IP address'},
  { key: 'use_password', text: 'Use a password to register agents'},
  { key: 'purge', text: 'Purge agents list when removing agents'},
  { key: 'limit_maxagents', text: 'Limit registration to maximum number of agents'},
  { key: 'force_insert', text: 'Force registration when using an existing IP address'}
];
const sslSettings = [
  { key: 'ssl_verify_host', text: 'Verify agents using a CA certificate'},
  { key: 'ssl_auto_negotiate', text: 'Auto-select the SSL negotiation method'},
  { key: 'ssl_manager_cert', text: 'Server SSL certificate location'},
  { key: 'ssl_manager_key', text: 'Server SSL key location'},
  { key: 'ciphers', text: 'Use the following SSL ciphers'}
];

class WzRegistrationService extends Component{
  constructor(props){
    super(props);
  }
  badgeEnabled(){
    return this.props.currentConfig['auth-auth'] && this.props.currentConfig['auth-auth'].auth && this.props.currentConfig['auth-auth'].auth.disabled === 'no';
  }
  render(){
    const { currentConfig } = this.props;
    const mainSettingsConfig = {
      disabled: currentConfig['auth-auth'].auth.disabled === 'yes'? 'disabled' : 'enabled',
      port: currentConfig['auth-auth'].auth.port,
      use_source_ip: currentConfig['auth-auth'].auth.use_source_ip,
      use_password: currentConfig['auth-auth'].auth.use_password,
      purge: currentConfig['auth-auth'].auth.purge,
      limit_maxagents: currentConfig['auth-auth'].auth.limit_maxagents,
      force_insert: currentConfig['auth-auth'].auth.force_insert
    };
    const sslSettingsConfig = {
      ssl_verify_host: currentConfig['auth-auth'].auth.ssl_verify_host,
      ssl_auto_negotiate: currentConfig['auth-auth'].auth.ssl_auto_negotiate,
      ssl_agent_ca: currentConfig['auth-auth'].auth.ssl_agent_ca,
      ssl_manager_cert: currentConfig['auth-auth'].auth.ssl_manager_cert,
      ssl_manager_key: currentConfig['auth-auth'].auth.ssl_manager_key,
      ciphers: currentConfig['auth-auth'].auth.ciphers
    };
    return (
      <Fragment>
        <WzConfigurationPath title='Registration service' description='Automatic agent registration service' path='Registration service' updateConfigurationSection={this.props.updateConfigurationSection} badge={this.badgeEnabled()}/>
        <WzConfigurationSettingsTabSelector
          title='Main settings'
          description='General settings applied to the registration service'
          currentConfig={currentConfig}
          helpLinks={helpLinks}>
            <WzConfigurationSettingsGroup
              config={mainSettingsConfig}
              items={mainSettings}
            />
            <WzConfigurationSettingsGroup
              title='SSL settings'
              description='Applied when the registration service uses SSL certificates'
              config={sslSettingsConfig}
              items={sslSettings}
              />
        </WzConfigurationSettingsTabSelector>
      </Fragment>
    )
  }
}

export default withWzConfig('000', [{component:'auth',configuration:'auth'}])(WzRegistrationService);
