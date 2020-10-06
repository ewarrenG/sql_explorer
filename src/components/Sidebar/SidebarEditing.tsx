import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, MenuItem, IconButton, Flex, ButtonTransparent, Box, SpaceVertical } from '@looker/components';
import styled from 'styled-components'
import { ROUTES } from '../../App';
import { SidebarContainer, SidebarHeading, SidebarBox, SidebarButton } from './SidebarComponents';
import AppContext from '../../AppContext';
import { exploreEmbedPath } from '../../helpers';

export function SidebarEditing() {

  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { qid, toggle, editing, setEditing, triggerDidIframeReload, triggerLidIframeReload, setAppParams } = useContext(AppContext)

  const handleSave = async () => {
    const query = await sdk.ok(sdk.query_for_slug(qid))
    if (editing.lid) {
      const update = await sdk.ok(sdk.update_look(editing.lid, {
        query_id: query.id
      }))
      triggerLidIframeReload();
      
      setAppParams({
        selection: ROUTES.EMBED_LOOK
      })
    } else if (editing.deid) {
      const update = await sdk.ok(sdk.update_dashboard_element(editing.deid, {
        query_id: query.id
      }))
      triggerDidIframeReload();
      setAppParams({
        selection: ROUTES.EMBED_DASHBOARD,
        did: editing.did
      })
    }
    setEditing(undefined)
  }

  const handleCancel = async () => {
    setEditing(undefined)
  }

  return (
    <>
      <StyledMenuItem
        key={`editing`}
        icon="EditOutline"
        selected={true}
      >
        Editing
      </StyledMenuItem>
      <StyledBox pl="xlarge" mb="xsmall">
        <SpaceVertical gap="xsmall">
          <SidebarHeading>Actions</SidebarHeading>
          <SidebarBox>
            <SidebarButton onClick={handleSave} children="Save Changes" />
            <SidebarButton onClick={handleCancel} children="Discard Changes" />
          </SidebarBox>
        </SpaceVertical>
      </StyledBox>
    </>
  );
}

const StyledMenuItem = styled(MenuItem)`
  list-style: none;
  background: #949dff26;
  &:hover { background: #949dff26; }
`

const StyledBox = styled(Box)`
  background: #949dff26;
`

