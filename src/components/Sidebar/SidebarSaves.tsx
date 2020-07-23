

import React, { useState, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { Dialog, DialogContent, DialogHeader, InputText, DialogFooter, Button, Spinner, Text } from '@looker/components';
import { SidebarButton } from './SidebarComponents';
import AppContext from '../../AppContext';
import { DashboardTabs } from './Dashboard/DashboardTabs';
import { IWriteDashboardElement } from '@looker/sdk/lib/sdk/3.1/models';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../App';
import { CreateLookFolderDialog } from './Look/CreateLookFolderDialog';

export function SidebarSaves() {
  const [db_open, setDbOpen] = useState(false)
  const [look_open, setLookOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [db_title, setDbTitle] = useState('')
  const [look_title, setLookTitle] = useState('')
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { did, qid, dashboard, setDashboard, triggerDidIframeReload, runRefreshes, setAppParams } = useContext(AppContext)
  

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
    const db = await sdk.ok(sdk.dashboard(did))
    setDashboard(db);
    setDbOpen(false);
    triggerDidIframeReload();
    setSaving(false);
    setAppParams({selection: ROUTES.EMBED_DASHBOARD})
    runRefreshes();
  }

  const handleLookSubmit = async (folder_id: string) => {
    setSaving(true)
    const query = await sdk.ok(sdk.query_for_slug(qid, 'id'))
    const look = await sdk.ok(sdk.create_look({
      folder_id,
      query_id: query.id,
      title: look_title
    }, 'id'))
    setAppParams({selection: ROUTES.EMBED_LOOK, lid: look.id})
    setLookOpen(false)
    setSaving(false)
    runRefreshes();
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
            <DashboardTabs is_saving={true} turnDialogOff={() => { }} />
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
        <CreateLookFolderDialog {...{
          look_title,
          setLookTitle,
          saving,
          handleLookSubmit
        }}/>
      </Dialog>
    </>
  );
}