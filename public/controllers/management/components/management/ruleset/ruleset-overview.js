import React, { Component } from 'react';
// Eui components
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiPage,
  EuiText,
  EuiTitle,
  EuiSwitch,
  EuiPopover,
  EuiButton,
  EuiButtonEmpty
} from '@elastic/eui';

import { connect } from 'react-redux';

// Wazuh components
import WzRulesetTable from './ruleset-table';
import WzRulesetSearchBar from './ruleset-search-bar';
import WzRulesetActionButtons from './actions-buttons';
import './ruleset-overview.css';


class WzRulesetOverview extends Component {
  constructor(props) {
    super(props);
    this.sectionNames = {
      rules: 'Rules',
      decoders: 'Decoders',
      lists: 'CDB lists'
    }
  }


  clickActionFilterBar(obj) {
    console.log('clicking ', obj)
  }

  render() {
    const { section } = this.props.state;

    return (
      <EuiPage style={{ background: 'transparent' }}>
        <EuiPanel>
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiTitle>
                <h2>{this.sectionNames[section]}</h2>
              </EuiTitle>
            </EuiFlexItem>
            {(section == 'rules' || section === 'decoders') && (
              <EuiFlexItem grow={false} style={{ paddingTop: 7 }}>
                <EuiSwitch
                  label={`Custom ${this.sectionNames[section]}`}
                  checked={false}
                  onChange={this.clickActionFilterBar}
                />
              </EuiFlexItem>
            )}
            <EuiFlexItem>
            </EuiFlexItem>
            <WzRulesetActionButtons />
          </EuiFlexGroup>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText color="subdued">
                {`From here you can manage your ${section}.`}
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
            <WzRulesetSearchBar />
          <EuiFlexGroup>
            <EuiFlexItem>
              <WzRulesetTable />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiPage>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    state: state.rulesetReducers
  };
};

export default connect(mapStateToProps)(WzRulesetOverview);
