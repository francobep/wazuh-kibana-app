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

import React, { Component, Fragment } from 'react';

import {
	EuiTitle,
	EuiFlexGroup,
	EuiFlexItem,
	EuiButtonEmpty
} from '@elastic/eui';

import WzConfigurationOverviewTable from './configuration-overview-table';
import WzHelpButtonPopover from './util-components/help-button-popover';
import WzBadge from './util-components/badge';

import { ExportConfiguration } from '../../../../agent/components/export-configuration';

import { updateConfigurationSection } from '../../../../../redux/actions/configurationActions';

import configurationSettingsGroup from './configuration-settings';

import { isString, isFunction } from './utils/utils';

const columns = [
	{
		field: 'name',
		name: 'Name'
	},
	{
		field: 'description',
		name: 'Description'
	}
];

const helpLinks = [
	{ text: 'Wazuh administration documentation', href: 'https://documentation.wazuh.com/current/user-manual/manager/index.html' },
	{ text: 'Wazuh capabilities documentation', href: 'https://documentation.wazuh.com/current/user-manual/capabilities/index.html' },
	{ text: 'Local configuration reference', href: 'https://documentation.wazuh.com/current/user-manual/reference/ossec-conf/index.html' }
];

class WzConfigurationOverview extends Component{
    constructor(props){
			super(props);
			this.settings = this.filterSettings(configurationSettingsGroup);
		}
		updateConfigurationSection(section, title, description, path){
			this.props.updateConfigurationSection(section, title, description, path);
		}
		filterSettingsIfAgentOrManager(settings){
			return settings.filter(setting => 
				(this.props.agent.id !== '000' && setting.when && ((isString(setting.when) && setting.when === 'agent') || isFunction(setting.when) && setting.when(this.props.agent))) ||
				(this.props.agent.id === '000' && setting.when && ((isString(setting.when) && setting.when === 'manager') || isFunction(setting.when) && setting.when(this.props.agent))) ||
				(isFunction(setting.when) && setting.when(this.props.agent)) ||
				(!setting.when && true)
			)
		}
		filterSettings(groups){
			return groups.map(group => {
				return { title: group.title, settings: this.filterSettingsIfAgentOrManager(group.settings) }
			}).filter(group => group.settings.length);
		}
    render(){
			return (
				<Fragment>
					<EuiFlexGroup>
						<EuiFlexItem>
							<EuiFlexGroup>
								<EuiFlexItem>
									<EuiTitle>
										<span>Configuration {this.props.agent.id !== '000' && <WzBadge synchronized={this.props.agentSynchronized}/>}</span>
									</EuiTitle>
								</EuiFlexItem>
							</EuiFlexGroup>
						</EuiFlexItem>
						<EuiFlexItem grow={false}>
							<EuiFlexGroup gutterSize="xs">
								<EuiFlexItem>
									{this.props.agent.id === '000' ? (
										<EuiButtonEmpty iconSide="left" iconType="pencil" onClick={() => this.updateConfigurationSection('edit-configuration', this.props.agent.id === '000' ? 'Manager configuration' : 'Agent configuration', '', 'Edit configuration')}>  {/* TODO: delete Agent configuration */}
											Edit configuration
										</EuiButtonEmpty>
									) : this.props.agent.status === 'Active' ? 
									<ExportConfiguration agent={this.props.agent} type='agent' exportConfiguration={(enabledComponents) => {this.props.exportConfiguration(enabledComponents)}}/> //TODO: export configuration
									: null}
								</EuiFlexItem>
								<EuiFlexItem>
									<WzHelpButtonPopover links={helpLinks}/>
								</EuiFlexItem>
							</EuiFlexGroup>
						</EuiFlexItem>
					</EuiFlexGroup>
					<EuiFlexGroup>
						<EuiFlexItem>
							{this.settings.map(group => (
								<WzConfigurationOverviewTable 
									key={`settings-${group.title}`}
									title={group.title}
									columns={columns}
									items={group.settings}
									onClick={this.props.updateConfigurationSection}
								/>
							))}
						</EuiFlexItem>
					</EuiFlexGroup>
				</Fragment>
			)
    }
}

export default WzConfigurationOverview;