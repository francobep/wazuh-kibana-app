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

import {
  EuiBasicTable
} from "@elastic/eui";

import WzNoConfig from '../util-components/no-config';
import WzConfigurationSettingsTabSelector from '../util-components/configuration-settings-tab-selector';

import helpLinks from './help-links';

const columns = [
  { field: 'path', name: 'Path' }
];

class WzPolicyMonitoringSystemAudit extends Component{
  constructor(props){
    super(props);
  }
  render(){
    let { currentConfig } = this.props;
    return (
      <Fragment>
        {currentConfig && currentConfig['syscheck-rootcheck'] && currentConfig['syscheck-rootcheck'].rootcheck && !currentConfig['syscheck-rootcheck'].rootcheck.system_audit && (
          <WzNoConfig error='not-present' help={helpLinks}/>
        )}
        {currentConfig && currentConfig['syscheck-rootcheck'] && currentConfig['syscheck-rootcheck'].rootcheck && currentConfig['syscheck-rootcheck'].rootcheck.system_audit && (
          <WzConfigurationSettingsTabSelector
            title='UNIX audit files'
            description='Specified paths to audit definition files for Unix-like systems'
            currentConfig={currentConfig}
            helpLinks={helpLinks}>
              <EuiBasicTable 
                items={currentConfig['syscheck-rootcheck'].rootcheck.system_audit}
                columns={columns}
              />
          </WzConfigurationSettingsTabSelector>
        )}
      </Fragment>
    )
  }
}

WzPolicyMonitoringSystemAudit.propTypes = {
  currentConfig: PropTypes.object.isRequired
};

export default WzPolicyMonitoringSystemAudit;