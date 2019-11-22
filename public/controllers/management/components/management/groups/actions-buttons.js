/*
 * Wazuh app - React component for registering agents.
 * Copyright (C) 2015-2019 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */
import React, { Component, Fragment } from 'react';
// Eui components
import {
  EuiFlexItem,
  EuiButtonEmpty,
  EuiPopover,
  EuiFormRow,
  EuiFieldText,
  EuiSpacer,
  EuiFlexGroup,
  EuiButton,
} from '@elastic/eui';

import { connect } from 'react-redux';

import {
  toggleShowFiles,
  updateLoadingStatus,
  updteAddingRulesetFile,
  updateListContent,
  updateIsProcessing,
  updatePageIndex,
} from '../../../../../redux/actions/rulesetActions';

import { WzRequest } from '../../../../../react-services/wz-request';
import exportCsv from '../../../../../react-services/wz-csv';
import { UploadFiles } from '../../upload-files';
import RulesetHandler from './utils/ruleset-handler';
import { toastNotifications } from 'ui/notify';

class WzGroupsActionButtons extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = { generatingCsv: false, isPopoverOpen: false, newGroupName: '' };
    this.exportCsv = exportCsv;

    this.wzReq = (...args) => WzRequest.apiReq(...args);

    this.rulesetHandler = RulesetHandler;
    this.refreshTimeoutId = null;
  }

  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) this.bindEnterToInput();
  }

  componentDidUpdate() {
    this.bindEnterToInput();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
   * Refresh the items
   */
  async refresh() {
    try {
      this.props.updateIsProcessing(true);
      this.onRefreshLoading();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  onRefreshLoading() {
    clearInterval(this.refreshTimeoutId);

    this.props.updateLoadingStatus(true);
    this.refreshTimeoutId = setInterval(() => {
      if (!this.props.state.isProcessing) {
        this.props.updateLoadingStatus(false);
        clearInterval(this.refreshTimeoutId);
      }
    }, 100);
  }

  togglePopover() {
    if (this.state.isPopoverOpen) {
      this.closePopover();
    } else {
      this.setState({ isPopoverOpen: true });
    }
  }

  closePopover() {
    this.setState({
      isPopoverOpen: false,
      msg: false,
      newGroupName: '',
    });
  }

  clearGroupName() {
    this.setState({
      newGroupName: '',
    });
  }

  onChangeNewGroupName = e => {
    this.setState({
      newGroupName: e.target.value,
    });
  };

  /**
   * Looking for the input element to bind the keypress event, once the input is found the interval is clear
   */
  bindEnterToInput() {
    try {
      const interval = setInterval(async () => {
        const input = document.getElementsByClassName('groupNameInput');
        if (input.length) {
          const i = input[0];
          if (!i.onkeypress) {
            i.onkeypress = async e => {
              if (e.which === 13) {
                await this.createGroup();
              }
            };
          }
          clearInterval(interval);
        }
      }, 150);
    } catch (error) {}
  }

  async createGroup() {
    try {
      this.props.updateLoadingStatus(true);
      const saver = await this.wzReq('PUT', `/agents/groups/${this.state.newGroupName}`, {});
      this.showToast('success', 'Success', 'The group has been created correctly', 2000);
      this.clearGroupName();

      this.props.updateIsProcessing(true);
      this.props.updateLoadingStatus(false);
      this.closePopover();
    } catch (error) {
      console.log('Error', error);
      this.props.updateLoadingStatus(false);
      this.showToast(
        'danger',
        'Error',
        `An error occurred when creating the group: ${error}`,
        2000
      );
    }
  }

  showToast = (color, title, text, time) => {
    toastNotifications.add({
      color: color,
      title: title,
      text: text,
      toastLifeTimeMs: time,
    });
  };

  render() {
    const { section, showingFiles, adminMode } = this.props.state;

    // Add new group button
    const newGroupButton = (
      <EuiButtonEmpty iconSide="left" iconType="plusInCircle" onClick={() => this.togglePopover()}>
        Add new groups
      </EuiButtonEmpty>
    );

    return (
      <Fragment>
        <EuiFlexItem grow={false}>
          <EuiPopover
            id="popover"
            button={newGroupButton}
            isOpen={this.state.isPopoverOpen}
            closePopover={() => this.closePopover()}
          >
            <EuiFormRow label="Introduce the group name" id="">
              <EuiFieldText
                className="groupNameInput"
                value={this.state.newGroupName}
                onChange={this.onChangeNewGroupName}
                aria-label=""
              />
            </EuiFormRow>
            <EuiSpacer size="xs" />
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiButton
                  iconType="save"
                  fill
                  onClick={async () => {
                    await this.createGroup();
                  }}
                >
                  Save new group
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPopover>
        </EuiFlexItem>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    state: state.rulesetReducers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleShowFiles: status => dispatch(toggleShowFiles(status)),
    updateLoadingStatus: status => dispatch(updateLoadingStatus(status)),
    updteAddingRulesetFile: content => dispatch(updteAddingRulesetFile(content)),
    updateListContent: content => dispatch(updateListContent(content)),
    updateIsProcessing: isProcessing => dispatch(updateIsProcessing(isProcessing)),
    updatePageIndex: pageIndex => dispatch(updatePageIndex(pageIndex)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WzGroupsActionButtons);
