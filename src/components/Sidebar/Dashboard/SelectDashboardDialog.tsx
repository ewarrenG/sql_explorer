
import React, { useState, useEffect, useContext } from 'react';
import { ExtensionContextData, ExtensionContext } from '@looker/extension-sdk-react';
import { DialogContent, Dialog } from '@looker/components';
import { SidebarButton } from '../SidebarComponents';
import AppContext from '../../../AppContext';
import { DashboardTabs } from './DashboardTabs';
import { ROUTES } from '../../../App';
import { LoadingSvg } from '../../LoadingSvg';


export function SelectDashboardDialog() {
  const [open, setOpen] = useState(false)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const sdk = extensionContext.coreSDK
  const { did, selection, all_dashboards, all_favorites } = useContext(AppContext)

  useEffect(() => {
    if (!did && selection === ROUTES.EMBED_DASHBOARD) {
      setOpen(true)
    }
  }, [])

  const turnDialogOff = () => { setOpen(false) }

  const ready = (all_dashboards && all_dashboards.length && all_favorites && all_favorites.dashboards)
  return (
    <>
      <Dialog
        isOpen={open}
        onClose={() => turnDialogOff()}
        maxWidth={"85vw"}
        width={"85vw"}
      >
      {!ready && <LoadingSvg m="xxlarge" toggle_loading={true}/> }
      { ready && <DialogContent
          minHeight="75vh"
          maxHeight="75vh"
          verticalAlign="center"
        >
          <DashboardTabs turnDialogOff={turnDialogOff} />
        </DialogContent>
        }
      </Dialog>
      <SidebarButton onClick={() => setOpen(true)}>Select Dashboard</SidebarButton>
    </>
  );
}
