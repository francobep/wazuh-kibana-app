import React, { Component, Fragment } from "react";
import Proptypes from "prop-types";

import {
  EuiBasicTable
} from "@elastic/eui";

import WzNoConfig from "../util-components/no-config";

import helpLinks from './help-links';

const renderTableField = (item) => item || '-';

const renderUrlAttr = (item) => {
  if(!item){
    return (
      <Fragment>
        {item.start && (
          <Fragment>
            <span><b>Start: </b>{item.start}</span><br></br>
          </Fragment>
        )}
        {item.start && (
          <Fragment>
            <span><b>End: </b>{item.start}</span><br></br>
          </Fragment>
        )}
        {item.start && (
          <Fragment>
            <span><b>Port: </b>{item.start}</span><br></br>
          </Fragment>
        )}
      </Fragment>
      
      )
  }
  return '-'
}

const columnsAllowAttr = [
  { field: 'replaced_os' , name: 'Replaced OS', render: renderTableField },
  { field: 'src' , name: 'Source', render: (item) => renderTableField(item.toSting()) },
];

const renderAllowAttr = (item) => {
  if(item){
    return (
      <EuiTable 
        items={item}
        columns={columnsAllowAttr}
      />
    )
  }
  return '-'
}

const columns = [
  { field: 'name', name: 'Name' , render: renderTableField },
  { field: 'version', name: 'Version' , render: renderTableField },
  { field: 'update_interval', name: 'Update interval' , render: renderTableField },
  { field: 'update_from_year', name: 'Update from year' , render: renderTableField },
  { field: 'path', name: 'Path' , render: renderTableField },
  { field: 'url', name: 'URL' , render: renderTableField },
  { field: 'url_attrs', name: 'URL attributes', render: renderUrlAttr },
  { field: 'allow', name: 'Allow' },
];

class WzConfigurationVulnerabilitiesProviders extends Component{
  constructor(props){
    super(props);
    console.log('vul providesr', this.props)
  }
  render(){
    const { config } = this.props;
    return (
      <Fragment>
        {(config['vulnerability-detector'] && !config['vulnerability-detector'].providers && (
          <WzNoConfig error='not-present' help={helpLinks}></WzNoConfig>
        )) || (
          <Fragment>
            <WzConfigurationSettingsTabSelector
              title='Providers'
              description='List of OVAL databases providers to check for vulnerability scans'
              currentConfig={config}
              helpLinks={helpLinks}
            >
              <EuiBasicTable
                items={config['vulnerability-detector']}
                columns={columns}/>
            </WzConfigurationSettingsTabSelector>
          </Fragment>
        )}
      </Fragment>
    )
  }
}

export default WzConfigurationVulnerabilitiesProviders;