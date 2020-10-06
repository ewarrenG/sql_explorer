import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Grid, Paragraph } from '@looker/components';
import styled from 'styled-components'
import { SqlContext } from '../SqlContext';
import { SqlSidebarConnection } from './SqlSidebarConnection'
import { SqlSidebarSchemas } from './SqlSidebarSchemas'
import { SqlSidebarTables } from './SqlSidebarTables';
import { SqlSidebarColumns } from './SqlSidebarColumns';
import { SqlSidebarRun } from './SqlSidebarRun';

export function StaticSqlSidebar() {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { use_model, setUseModel, current_tables } = useContext(SqlContext)

  useEffect(() => {

  }, [])

  return (
    <StyledBox p="xxsmall">
      <SqlSidebarRun />
    </StyledBox>
  );
}

const StyledBox = styled(Box)`
  border-left: 1px solid #F0F0F0;
  overflow-y: hidden
`