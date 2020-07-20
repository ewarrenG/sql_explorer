
import React, { useState, useEffect, useContext } from 'react';
import { DialogContent, Tabs, TabList, Tab, TabPanels, TabPanel, useToggle, Dialog } from '@looker/components';
import { SidebarButton } from './SidebarComponents';
import AppContext from '../../AppContext';
import { LookTabs } from './LookTabs';
import { ROUTES } from '../../App';


export function SelectLookDialog() {
  const [open, setOpen] = useState(false)
  const { lid, selection } = useContext(AppContext)

  useEffect(() => {
    if (!lid && selection === ROUTES.EMBED_LOOK) {
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
          <LookTabs turnDialogOff={turnDialogOff} />
        </DialogContent>

      </Dialog>
      <SidebarButton onClick={() => setOpen(true)}>Select SQL Look</SidebarButton>
    </>
  );
}
