import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Box, Grid } from '@looker/components';
import styled from 'styled-components'
import { SqlContext } from '../SqlContext';
import { SqlSidebarConnection } from './SqlSidebarConnection'
import { SqlSidebarSchemas } from './SqlSidebarSchemas'
import { SqlSidebarTables } from './SqlSidebarTables';
import { SqlSidebarColumns } from './SqlSidebarColumns';
import { SqlSidebarRun } from './SqlSidebarRun';

export function SqlSidebar() {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { use_model, setUseModel, current_tables } = useContext(SqlContext)

  useEffect(()=>{
    
  },[])
  
  return (
    <StyledBox p="xxsmall">
      <SqlSidebarRun />
      <Tabs
        index={(use_model) ? 0 : 1} 
        onChange={(v)=>{setUseModel((v === 0) ? true : false )}}
      >
        <TabList>
          <Tab>Modeled SQL</Tab>
          <Tab>SQL</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            hi
          </TabPanel>
          <TabPanel>
            <SqlSidebarConnection />
            <SqlSidebarSchemas />
            <Grid columns={1}>
              <SqlSidebarTables />
              {current_tables && current_tables.length && <SqlSidebarColumns />}
            </Grid>
            
          </TabPanel>
        </TabPanels>
      </Tabs>
    </StyledBox>
  );
}

const StyledBox = styled(Box)`
  border-left: 1px solid #F0F0F0;
  overflow-y: hidden
`