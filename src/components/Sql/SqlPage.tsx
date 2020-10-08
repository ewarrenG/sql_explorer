import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, Button, Box, Accordion, AccordionDisclosure, AccordionContent, Grid, Flex, FlexItem } from '@looker/components';
import styled from 'styled-components'
import AppContext from '../../AppContext';
import { SqlContext } from './SqlContext';
import { SqlEditor } from './SqlEditor'
// import { SqlSidebar } from './Sidebar/SqlSidebar';
import { StaticSqlSidebar } from './Sidebar/StaticSqlSidebar';
import { SqlErrors } from './SqlErrors'
import { SqlResults } from './SqlResults';
import { SqlQueries } from './SqlQueries';

export function SqlPage() {
  const { sql } = useContext(AppContext)
  const { connections, models, use_model } = useContext(SqlContext)
  const handleRun = (e) => {

  }

  useEffect(() => {
    // getConnections();
  }, [])

  useEffect(() => {

  }, [sql])


  const height = (use_model) ? [33, 33, 33] : [50, 0, 50]
  return (
    <SidebarGrid
      gap="none"
      p="large"
    >
      <StyledFlex p="xxsmall" flexDirection="column">
        <SqlErrors />
        <FlexItem>
          {/* Dropdown to go here??? */}
          <SqlQueries />
        </FlexItem>
        <FlexItem height={`${height[0]}%`}>
          <SqlEditor />
        </FlexItem>
        <FlexItem height={`${height[1]}%`}>
          {use_model && <>Prepared SQL</>}
        </FlexItem>
        <FlexItem height={`${height[2]}%`}>
          <SqlResults />
        </FlexItem>
      </StyledFlex>
      {/* <SqlSidebar/> */}
      <StaticSqlSidebar />
    </SidebarGrid>
  );
}

const StyledFlex = styled(Flex)`
  height: 100vh;
  overflow: scroll
`

const SidebarGrid = styled(Grid)`
  height: 100vh;
  grid-template-columns: auto 400px ;
`