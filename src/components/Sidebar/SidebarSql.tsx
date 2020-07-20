
import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { MenuList, MenuItem, Box, SpaceVertical, Heading, Checkbox, Paragraph } from '@looker/components';
import styled from 'styled-components'
import AppContext from '../../AppContext';
import { SidebarContainer, SidebarHeading, SidebarBox, SidebarButton, SidebarText, SidebarCheckbox } from './SidebarComponents';
import { SelectDashboardDialog } from './SelectDashboardDialog';
import { SidebarGroupDashboard } from './SidebarGroupDashboard';
import { SidebarSaves } from './SidebarSaves';

export function SidebarSql() {
  const {sql_options, setSqlOptions, sql, dashboard} = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK } = extensionContext
  const sdk = extensionContext.coreSDK

  const handleCheck = (id) => {
    setSqlOptions({...sql_options, [id]: !sql_options[id]})
  }

  const newCheckbox = (id, label) => {
    return  <SidebarCheckbox 
      label={label}
      checked={sql_options[id]}
      onChange={()=>{handleCheck(id)}}
    />
  }
  
  return (
    <SidebarContainer>
      <SidebarHeading>Explore Options</SidebarHeading>
      <SidebarBox>
        {newCheckbox('keep_vis', 'Keep Vis Settings')}
        {newCheckbox('keep_fields', 'Keep Field Selections')}
        {newCheckbox('keep_filters', 'Keep Filters')}
        {newCheckbox('keep_sorts', 'Keep Sorts')}
        {newCheckbox('keep_dynamic_fields', 'Keep Custom Fields')}
      </SidebarBox>
      <SidebarGroupDashboard/>
      <SidebarHeading>Actions</SidebarHeading>
      <SidebarBox>
        <SidebarButton onClick={()=>{extensionSDK.openBrowserWindow(`/sql/${sql}`)}}>Open in Looker</SidebarButton>
      </SidebarBox>
    </SidebarContainer>
  );
}

