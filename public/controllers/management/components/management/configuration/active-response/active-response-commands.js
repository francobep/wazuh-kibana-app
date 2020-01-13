/*
* Wazuh app - React component for registering agents.
* Copyright (C) 2015-2020 Wazuh, Inc.
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
*
* Find more information about this on the LICENSE file.
*/

import React, { Component, Fragment } from "react";
import Proptypes from "prop-types";

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiButtonEmpty
} from "@elastic/eui";

import WzNoConfig from '../util-components/no-config';
import WzConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';
import WzConfigurationSettingsGroup from '../util-components/configuration-settings-group';
import WzConfigurationSettingsListSelector from '../util-components/configuration-settings-list-selector';
import { isString } from '../utils/utils';
import { settingsListBuilder } from '../utils/builders';

import { connect } from 'react-redux';

const helpLinks = [
  { text: 'Active response documentation', label: 'https://documentation.wazuh.com/current/user-manual/capabilities/active-response/index.html' },
  { text: 'Commands reference', label: 'https://documentation.wazuh.com/current/user-manual/reference/ossec-conf/commands.html' }
];

const mainSettings = [
  { field: 'name', label: 'Command name' },
  { field: 'executable', label: 'Name of executable file' },
  { field: 'expect', label: 'List of expected fields' },
  { field: 'extra_args', label: 'Extra arguments' },
  { field: 'timeout_allowed', label: 'Allow this command to be reverted' }
];

class WzConfigurationActiveResponseCommands extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const { selectedItem } = this.state;
    const { currentConfig, wazuhNotReadyYet } = this.props;
    const items = settingsListBuilder(currentConfig['analysis-command'].command, 'name');
    const selectedItemConfig = currentConfig['analysis-command'].command[selectedItem] ? {
      ...currentConfig['analysis-command'].command[selectedItem],
      timeout_allowed: currentConfig['analysis-command'].command[selectedItem].timeout_allowed ? 'yes' : 'no'
    } : {};
    return (
      <Fragment>
        {currentConfig['analysis-command'] && isString(currentConfig['analysis-command']) && (
          <WzNoConfig error={currentConfig['analysis-command']} help={helpLinks} />
          )}
        {currentConfig['analysis-command'] && !isString(currentConfig['analysis-command']) && currentConfig['analysis-command'].command && !currentConfig['analysis-command'].command.length && (
          <WzNoConfig error='not-present' help={helpLinks} />
          )}
        {wazuhNotReadyYet && (!currentConfig || !currentConfig['analysis-command']) && ( 
          <WzNoConfig error='Wazuh not ready yet' help={helpLinks} />
        )}
        {currentConfig['analysis-command'] && !isString(currentConfig['analysis-command']) && currentConfig['analysis-command'].command && currentConfig['analysis-command'].command.length ? (
          <WzConfigurationSettingsTabSelector
            title='Command definitions'
            description='Find here all the currently defined commands used for Active response'
            currentConfig={currentConfig}
            helpLinks={helpLinks}>
              <WzConfigurationSettingsListSelector
                items={items}
                settings={mainSettings}
              />
          </WzConfigurationSettingsTabSelector>
        ) : null}
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  wazuhNotReadyYet: state.configurationReducers.wazuhNotReadyYet
});

export default connect(mapStateToProps)(WzConfigurationActiveResponseCommands);