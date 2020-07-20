
import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { DialogContent, Dialog } from '@looker/components';
import { SidebarButton } from './SidebarComponents';
import AppContext from '../../AppContext';
import { DashboardTabs } from './DashboardTabs';
import { ROUTES } from '../../App';


export function SelectDashboardDialog() {
  const [open, setOpen] = useState(false)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { did, selection } = useContext(AppContext)

  useEffect(() => {
    if (!did && selection === ROUTES.EMBED_DASHBOARD) {
      setOpen(true)
    }
  }, [])

  const turnDialogOff = () => { setOpen(false) }
  
  return (
    <>
      <Dialog
        isOpen={open}
        onClose={() => turnDialogOff()}
        maxWidth={"85vw"}
        width={"85vw"}
      >
        <DialogContent>
          <DashboardTabs turnDialogOff={turnDialogOff} />
        </DialogContent>

      </Dialog>
      <SidebarButton onClick={() => setOpen(true)}>Select Dashboard</SidebarButton>
    </>
  );
}
