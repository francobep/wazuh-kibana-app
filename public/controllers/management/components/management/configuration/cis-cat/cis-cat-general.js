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
import PropTypes from "prop-types";

import WzConfigurationSettingsTabSelector from "../util-components/configuration-settings-tab-selector";
import WzConfigurationSettingsGroup from "../util-components/configuration-settings-group";
import helpLinks from './help-links';
import { renderValueNoThenEnabled } from '../utils/utils';

const mainSettings = [
  { field: 'disabled', label: 'CIS-CAT integration status', render: renderValueNoThenEnabled},
  { field: 'timeout', label: 'Timeout (in seconds) for scan executions' },
  { field: 'java_path', label: 'Path to Java executable directory' },
  { field: 'ciscat_path', label: 'Path to CIS-CAT executable directory' }
];

const schedulingSettings = [
  { field: 'interval', label: 'Interval between scan executions' },
  { field: 'scan-on-start', label: 'Scan on start' },
  { field: 'day', label: 'Day of the month to run scans' },
  { field: 'wday', label: 'Day of the week to run scans' },
  { field: 'time', label: 'Time of the day to run scans' }
];

class WzConfigurationCisCatGeneral extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const { currentConfig } = this.props;
    return (
      <Fragment>
        <WzConfigurationSettingsTabSelector
          title='Main settings'
          description='General settings applied to all benchmarks'
          currentConfig={currentConfig}
          helpLinks={helpLinks}>
            <WzConfigurationSettingsGroup 
              config={currentConfig['cis-cat']}
              items={mainSettings}
            />
            <WzConfigurationSettingsGroup
              title='Scheduling settings'
              description='Customize CIS-CAT scans scheduling'
              config={currentConfig['cis-cat']}
              items={schedulingSettings}
            />
        </WzConfigurationSettingsTabSelector>

      </Fragment>
    )
  }
}

WzConfigurationCisCatGeneral.propTypes = {
  currentConfig: PropTypes.object.isRequired,
}
export default WzConfigurationCisCatGeneral;