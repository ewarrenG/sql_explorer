
import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { MenuList, MenuItem, Box, SpaceVertical, Heading, Checkbox, Paragraph } from '@looker/components';
import styled from 'styled-components'
import AppContext from '../../AppContext';
import { SidebarContainer, SidebarHeading, SidebarBox, SidebarButton, SidebarText, SidebarCheckbox } from './SidebarComponents';
import { SidebarGroupDashboard } from './SidebarGroupDashboard';

export function SidebarDashboard() {
  const {dashboard_options, setDashboardOptions, did} = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK } = extensionContext

  const handleCheck = (id) => {
    setDashboardOptions({...dashboard_options, [id]: !dashboard_options[id]})
  }

  const newCheckbox = (id, label) => {
    return  <SidebarCheckbox 
      label={label}
      checked={dashboard_options[id]}
      onChange={()=>{handleCheck(id)}}
    />
  }

  const next = (dashboard_options['dashboard_next']) ? '-next' : ''
  
  return (
    <SidebarContainer>
      <SidebarGroupDashboard hide_title={true}/>
      <SidebarHeading>Options</SidebarHeading>
      <SidebarBox>
        {newCheckbox('dashboard_next', 'Dashboard Next')}
      </SidebarBox>
      {did && <>
        <SidebarHeading>Actions</SidebarHeading>
        <SidebarBox>
          <SidebarButton onClick={()=>{extensionSDK.openBrowserWindow(`/dashboards${next}/${did}`)}}>Open in Looker</SidebarButton>
        </SidebarBox>
      </>}
    </SidebarContainer>
  );
}

