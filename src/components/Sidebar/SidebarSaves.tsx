

import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Code, Tooltip, Dialog, DialogContent, DialogHeader, InputText, DialogFooter, Button, Spinner, Heading, SpaceVertical, Grid, Text } from '@looker/components';
import styled from 'styled-components'
import { SidebarButton } from './SidebarComponents';
import AppContext from '../../AppContext';
import { DashboardTabs } from './DashboardTabs';
import { IWriteDashboardElement } from '@looker/sdk/lib/sdk/3.1/models';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../App';
import { SelectFolderDialog } from './SelectFolderDialog';

export function SidebarSaves() {
  const [db_open, setDbOpen] = useState(false)
  const [look_open, setLookOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [db_title, setDbTitle] = useState('')
  const [look_title, setLookTitle] = useState('')
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { did, qid, dashboard, search, setDashboardRefresh, dashboard_refresh, setLid } = useContext(AppContext)
  let history = useHistory();

  const handleDbSubmit = async () => {
    setSaving(true)
    const slug = await sdk.ok(sdk.query_for_slug(qid))
    const body: IWriteDashboardElement = {
      dashboard_id: did,
      query_id: slug.id,
      type: 'vis',
      title: (db_title.length) ? db_title : 'New SQL Tile'
    }
    const element = await sdk.ok(sdk.create_dashboard_element(body))
    setDbOpen(false)
    setDashboardRefresh(dashboard_refresh + 1)
    setSaving(false)
    history.push(ROUTES.EMBED_DASHBOARD + search)
  }

  const handleLookSubmit = async (folder_id: string) => {
    setSaving(true)
    const query = await sdk.ok(sdk.query_for_slug(qid, 'id'))
    const look = await sdk.ok(sdk.create_look({
      folder_id,
      query_id: query.id,
      title: look_title
    }, 'id'))
    history.push(ROUTES.EMBED_LOOK + search)
    setLid(look.id)
    setLookOpen(false)
    setSaving(false)
  }

  const db_dialog_ready = (did && dashboard && dashboard.title)
  
  return (
    <>
      <SidebarButton onClick={() => setLookOpen(true)}>Save as Look</SidebarButton>
      <SidebarButton onClick={() => setDbOpen(true)}>Save to Dashboard</SidebarButton>
      {/* Save Dashboard Dialog */}
      <Dialog
        isOpen={db_open}
        onClose={() => setDbOpen(false)}
        maxWidth={(db_dialog_ready) ? "35vw" : "85vw"}
        width={(db_dialog_ready) ? "35vw" : "85vw"}
      >
        {db_dialog_ready && <>
          <DialogHeader>
            Add tile to {dashboard.title}
          </DialogHeader>
          <DialogContent>
            <InputText
              placeholder="Enter tile title"
              value={db_title}
              onChange={(e) => {
                setDbTitle(e.target.value || '')
              }}
            />
          </DialogContent>

          <DialogFooter>
            <Button
              width="100px"
              size="small"
              disabled={saving || !dashboard.can.update}
              onClick={handleDbSubmit}
            >{(saving) ? <Spinner /> : "Submit"}
            </Button>
            { !dashboard.can.update && <Text fontSize="xxsmall">You don't have permission to edit this dashboard</Text>}
          </DialogFooter>
        </>}

        {!db_dialog_ready && <>
          <DialogContent>
            <DashboardTabs turnDialogOff={() => { }} />
          </DialogContent>
        </>
        }
      </Dialog>
      {/* Save Look Dialog */}
      <Dialog
        isOpen={look_open}
        onClose={() => setLookOpen(false)}
        maxWidth={"35vw"}
        width={"35vw"}
      >
        <SelectFolderDialog {...{
          look_title,
          setLookTitle,
          saving,
          handleLookSubmit
        }}/>

        
        
      </Dialog>
    </>
  );
}