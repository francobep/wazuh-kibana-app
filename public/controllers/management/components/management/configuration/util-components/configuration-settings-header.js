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
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiLink,
  EuiSpacer,
  EuiText,
  EuiTitle
} from "@elastic/eui";

import WzHelpButtonPopover from './help-button-popover';

class WzConfigurationSettingsHeader extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const { title, description, json, help, settings, xml, viewSelected } = this.props;
    return (
      <Fragment>
        <EuiFlexGroup alignItems='center'>
          <EuiFlexItem>
            <EuiTitle size='s'>
              <h2>{title}</h2>
            </EuiTitle>
            {description && <EuiText color='subdued'>{description}</EuiText>}
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup alignItems='center' gutterSize='none'>
              { settings && (
                <Fragment>
                  <ButtonLink viewSelected={viewSelected} view='' text='SETTINGS' onClick={settings}/>
                  <EuiFlexItem>
                    <span style={{margin: '0 4px'}}>·</span>
                  </EuiFlexItem>
                </Fragment>
              )}
              { json && xml && (
                <Fragment>
                  <ButtonLink viewSelected={viewSelected} view='json' text='JSON' onClick={json}/>
                  <EuiFlexItem>
                    <span style={{margin: '0 4px'}}>·</span>
                  </EuiFlexItem>
                  <ButtonLink viewSelected={viewSelected} view='xml' text='XML' onClick={xml}/>
                </Fragment>
              )}
              { help && (
                <WzHelpButtonPopover links={help} />
              )}
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size='xs'/>
        {title && <EuiHorizontalRule margin='none'/>}
      </Fragment>
    )
  }
}

WzConfigurationSettingsHeader.propTypes = {
  title: Proptypes.string,
  description: Proptypes.string
}

const ButtonLink = ({ onClick, text, view, viewSelected }) => {
  return (
    <EuiFlexItem>
      <EuiLink style={ viewSelected === view ? {textDecoration: 'underline'} : {} }onClick={onClick}>{text}</EuiLink>
    </EuiFlexItem>
  )
}

export default WzConfigurationSettingsHeader;

export class WzConfigurationSettingsHeaderViewer extends Component{
  constructor(props){
    super(props);
    this.title = this.props.mode === 'json' ? 'JSON viewer' : 'XML viewer';
    this.description = this.props.mode === 'json' ?
      'View this configuration in raw JSON format' :
      'View this configuration in raw XML format';
  }
  render(){
    return (
      <WzConfigurationSettingsHeader {...this.props} title={this.title} description={this.description}/>
    )
  }
}
