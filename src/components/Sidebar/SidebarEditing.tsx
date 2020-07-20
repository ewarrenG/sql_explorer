import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, MenuItem, IconButton, Flex, ButtonTransparent } from '@looker/components';
import styled from 'styled-components'
import { ROUTES } from '../../App';
import { SidebarContainer, SidebarHeading, SidebarBox, SidebarButton } from './SidebarComponents';
import AppContext from '../../AppContext';
import { exploreEmbedPath } from '../../helpers';

export function SidebarEditing() {

  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { qid, toggle, setLid, editing, setEditing, setQidEmbedPath, triggerDashboardRefresh } = useContext(AppContext)

  const handleSave = async () => {
    const query = await sdk.ok(sdk.query_for_slug(qid))
    if (editing.lid) {
      setLid(undefined)
      const update = await sdk.ok(sdk.update_look(editing.lid, {
        query_id: query.id
      }))
      setLid(editing.lid)
    } else if (editing.deid) {
      const update = await sdk.ok(sdk.update_dashboard_element(editing.deid, {
        query_id: query.id
      }))
      triggerDashboardRefresh();
    }
    setEditing(undefined)
  }

  const handleCancel = async () => {
    setQidEmbedPath(exploreEmbedPath(qid, toggle))
    setEditing(undefined)
  }
 
  return (
    <>
      <MenuItem
        icon="EditOutline"
        selected={true}
      >
        Editor
      </MenuItem>
      <SidebarContainer>
        <SidebarHeading>Options</SidebarHeading>
        <SidebarBox>
          <SidebarButton onClick={handleSave} children="Save Changes" />
          <SidebarButton onClick={handleCancel} children="Discard Changes" />
        </SidebarBox>
      </SidebarContainer>
    </>
  );
}

const StyledCode = styled(Code)`
  white-space: pre;
`