import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Grid, Paragraph, Select } from '@looker/components';
import styled from 'styled-components'
import { SqlContext } from './SqlContext';
import { SqlSidebarConnection } from './Sidebar/SqlSidebarConnection'
import { SqlSidebarSchemas } from './Sidebar/SqlSidebarSchemas'
import { SqlSidebarTables } from './Sidebar/SqlSidebarTables';
import { SqlSidebarColumns } from './Sidebar/SqlSidebarColumns';
import { SqlSidebarRun } from './Sidebar/SqlSidebarRun';

export function SqlQueries() {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { use_model, setUseModel, current_tables, selected_query, setSelectedQuery, setWrittenSql } = useContext(SqlContext)


  /**
   * need input from team for these
   */
  const dropdownSqlQueries = [{
    value: 'SELECT COUNT(*) FROM order_items', //works
  }, {
    value: 'SELECT COUNT(*) FROM events', //works
  }, {
    value: 'SELECT COUNT(*) FROM sessions', //not working
  }, {
    value: 'SELECT COUNT(*) FROM affinity', //not working
  }];


  useEffect(() => {
    if (!selected_query) {
      setSelectedQuery(dropdownSqlQueries[0].value)
    }
  }, []);

  useEffect(() => {
    setWrittenSql(selected_query ? selected_query : '')
  }, [selected_query])


  return (
    <Select
      options={dropdownSqlQueries}
      onChange={(value) => {
        console.log('value', value);
        setSelectedQuery(value);
      }}
    />
  );
}