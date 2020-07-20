
import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { DialogContent, Dialog, DialogHeader, DialogFooter, Button, Text } from '@looker/components';
import { SidebarButton } from './SidebarComponents';
import AppContext from '../../AppContext';
import { DashboardTabs } from './DashboardTabs';
import { ROUTES } from '../../App';
import { DashboardElementActionList } from './DashboardElementActionList';
import { filter } from 'lodash';


export function SidebarDashboardElementEdit() {
  const [open, setOpen] = useState(false)
    const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { did, dashboard } = useContext(AppContext)

  useEffect(() => {

  }, [])

  const turnDialogOff = () => { setOpen(false) }
  const all_elements = filter(dashboard.dashboard_elements, (e: any)=>{
    const model = ( e?.query?.model ) ? e.query.model : ''
    return (model.substring(0,5)==='sql__')
  })
  return (
    <>
      <Dialog
        isOpen={open}
        onClose={() => turnDialogOff()}
        maxWidth={"35vw"}
        width={"35vw"}
      >
        <DialogHeader>Choose a SQL tile to edit</DialogHeader>
        <DialogContent>
          <DashboardElementActionList {...{turnDialogOff, all_elements}} />
        </DialogContent>
      </Dialog>
      <SidebarButton onClick={() => setOpen(true)}>Edit SQL Tiles</SidebarButton>
    </>
  );
}
