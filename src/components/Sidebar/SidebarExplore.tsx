
import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import styled from 'styled-components'
import AppContext from '../../AppContext';
import { SidebarHeading, SidebarBox, SidebarContainer, SidebarButton, SidebarCheckbox } from './SidebarComponents';
import { exploreEmbedPath } from '../../helpers';
import { SelectDashboardDialog } from './SelectDashboardDialog';
import { SidebarGroupDashboard } from './SidebarGroupDashboard';
import { SidebarSaves } from './SidebarSaves';

export function SidebarExplore() {
  const { sql_options, setSqlOptions, sql, qid, toggle, setQid, setQidEmbedPath } = useContext(AppContext)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK } = extensionContext
  const sdk = extensionContext.coreSDK
  const { did } = useContext(AppContext)

  const handleCheck = (id) => {
    setSqlOptions({ ...sql_options, [id]: !sql_options[id] })
  }

  const newCheckbox = (id, label) => {
    return <SidebarCheckbox
      label={label}
      checked={sql_options[id]}
      onChange={() => { handleCheck(id) }}
    />
  }

  const deselectFields = async () => {
    const {id, client_id, ...query} = await sdk.ok(sdk.query_for_slug(qid))
    const new_query = await sdk.ok(sdk.create_query({...query, fields: []}))
    const new_qid = new_query.client_id
    setQid(new_qid)
    setQidEmbedPath(exploreEmbedPath(new_qid, toggle))
  }
  
  return (
    <SidebarContainer>
      {/* <SidebarHeading>Options</SidebarHeading>
      <SidebarBox>
        
      </SidebarBox> */}
      <SidebarGroupDashboard/>
      <SidebarHeading>Actions</SidebarHeading>
      <SidebarBox>
        <SidebarButton onClick={deselectFields}>Deselect All Fields</SidebarButton>
        <SidebarButton onClick={()=>{extensionSDK.openBrowserWindow(`/x/${qid}`)}}>Open in Looker</SidebarButton>
        <SidebarSaves/>
      </SidebarBox>
    </SidebarContainer>
  );
}

