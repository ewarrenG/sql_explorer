
import React, { useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import AppContext from '../../AppContext';
import { SidebarContainer, SidebarHeading, SidebarBox, SidebarButton, SidebarText, SidebarCheckbox } from './SidebarComponents';
import { SidebarGroupLook } from './SidebarGroupLook';

export function SidebarLook() {
  const {sql_options, setSqlOptions, lid} = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK } = extensionContext

  return (
    <SidebarContainer>
      <SidebarGroupLook hide_title={true} />
      <SidebarHeading>Actions</SidebarHeading>
      <SidebarBox>
        <SidebarButton onClick={()=>{extensionSDK.openBrowserWindow(`/looks/${lid}`)}}>Open in Looker</SidebarButton>
      </SidebarBox>
    </SidebarContainer>
  );
}

